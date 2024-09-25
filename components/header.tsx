"use client";

import { useSession } from "next-auth/react";
import LoginRegisterButton from "./sidebar/login-register-button";
import Sidebar from "./sidebar/sidebar";
import SidebarButton from "./sidebar/sidebar-button";
import Wrapper from "./sidebar/wrapper";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header
      className="
        flex
        flex-col
        bg-blue-600
        px-4
        pt-2
        pb-12
        rounded-b-3xl
      "
    >
      <div className="flex items-center justify-between mb-4">
        <Wrapper />
        <SidebarButton />
        {session ? <></> : <LoginRegisterButton />}
        <Sidebar />
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="sm:text-5xl text-3xl font-light text-white">
          MasterCoin
        </h1>
        <p className="sm:text-xl text-base text-white/40">
          Start making money plans
        </p>
      </div>
    </header>
  );
};

export default Header;
