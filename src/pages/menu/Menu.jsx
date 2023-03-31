import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import SidebarCustom from "../../components/Sidebar";
import { AuthContext } from "../../context/auth/authContext";

const Menu = () => {
  
  const authContext =  useContext( AuthContext );

  return (
    <SidebarCustom>
    <Loader/>
      <Outlet />
    </SidebarCustom>
  )
}

export default Menu;
