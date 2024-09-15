"use client";

import useSidebar from "@/hooks/use-sidebar";
import { MdOutlineMenu } from "react-icons/md";

const SidebarButton = () => {
  const sidebar = useSidebar();

  const openSidebar = () => {
    sidebar.onOpen();
  };

  return (
    <button
      className="
        border
        border-gray-300/20
        py-1
        px-2
        cursor-pointer
        rounded-md
      "
      onClick={openSidebar}
    >
      <MdOutlineMenu size={28} className="text-gray-300/70" />
    </button>
  );
};

export default SidebarButton;
