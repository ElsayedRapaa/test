import LoginRegisterButton from "./sidebar/login-register-button";
import Sidebar from "./sidebar/sidebar";
import SidebarButton from "./sidebar/sidebar-button";
import Wrapper from "./sidebar/wrapper";

const Header = () => {
  return (
    <header
      className="
        flex
        items-center
        justify-between
        bg-blue-600
        px-4
        pt-2
        pb-12
        rounded-b-3xl
      "
    >
      <Wrapper />
      <SidebarButton />
      <LoginRegisterButton />
      <Sidebar />
    </header>
  );
};

export default Header;
