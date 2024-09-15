"use client";

import useSidebar from "@/hooks/use-sidebar";
import Link from "next/link";
import { IconType } from "react-icons";

type SidebarItemsProps = {
  id?: number;
  title: string;
  href: string;
  icon: IconType;
};

const SidebarItems: React.FC<SidebarItemsProps> = ({
  title,
  href,
  icon: Icon,
}) => {
  const sidebar = useSidebar();

  const sidebarClose = () => {
    sidebar.onClose();
  };

  return (
    <Link
      href={href}
      className="
        flex
        items-center
        gap-x-2
        text-blue-600
      "
      onClick={sidebarClose}
    >
      <Icon size={24} />
      {title}
    </Link>
  );
};

export default SidebarItems;
