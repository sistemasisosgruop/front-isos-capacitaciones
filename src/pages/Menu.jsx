import { Outlet } from "react-router-dom";
import SidebarCustom from "../components/sidebar/Sidebar";

const Menu = () => {
  return (
    <SidebarCustom>
      <Outlet />
    </SidebarCustom>
  );
};

export default Menu;
