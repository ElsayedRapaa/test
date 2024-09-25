"use client";

import { useSession, signOut } from "next-auth/react";

import { MdClose } from "react-icons/md";
import { sidebarLinks } from "./sidebar-links/links";

import useSidebar from "@/hooks/use-sidebar";
import SidebarItems from "./sidebar-items";

const Sidebar = () => {
  const { data: session } = useSession();
  const sidebar = useSidebar();

  const closeSidebar = () => {
    sidebar.onClose();
  };

  return (
    <aside
      className={`
        fixed
        inset-0
        top-0
        transition-transform
        duration-300
        sm:w-[320px]
        w-[220px]
        bg-white
        shadow-lg
        sm:pl-8
        pl-4
        pt-24
        z-50
        ${sidebar.isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <MdClose
        size={24}
        className="cursor-pointer absolute top-1 right-2 text-black"
        onClick={closeSidebar}
      />
      <p className="text-black mb-6">Function</p>
      <div
        className="
          flex
          flex-col
          gap-y-6
        "
      >
        {sidebarLinks.map((item) => (
          <SidebarItems
            key={item.id}
            title={item.title}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </div>
      {session && (
        <button
          className="
            px-4
            py-1
            rounded-md
            bg-blue-600
            text-white
            cursor-pointer
            hover:bg-blue-700
            duration-300
            mt-6
          "
          onClick={() => signOut()}
        >
          Logout
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
