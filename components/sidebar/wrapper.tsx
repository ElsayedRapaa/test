"use client";

import useSidebar from "@/hooks/use-sidebar";

const Wrapper = () => {
  const sidebar = useSidebar();

  const closeSidebar = () => {
    sidebar.onClose();
  };

  return (
    <div
      className={`
        fixed
        inset-0
        bg-black
        transition-opacity
        duration-300
        z-20
        ${sidebar.isOpen ? "opacity-30" : "opacity-0 pointer-events-none"}
      `}
      onClick={closeSidebar}
    ></div>
  );
};

export default Wrapper;
