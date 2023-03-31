import { useContext } from "react";
import { Outlet } from "react-router-dom";
import SidebarCustom from "../../components/Sidebar";
import { AuthContext } from "../../context/auth/authContext";

const Menu = () => {
  
  const authContext =  useContext( AuthContext );

  return (
    <SidebarCustom>
      <Outlet />
    </SidebarCustom>
  )
}

export default Menu;
