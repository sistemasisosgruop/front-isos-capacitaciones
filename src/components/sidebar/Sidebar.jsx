import { Sidebar, Menu, useProSidebar } from "react-pro-sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import logoIsos from "../../assets/img/logoallincode.png";
import NavBar from "../NavBar";
import ItemsAdmin from "./ItemsAdmin";
import { AuthContext } from "../../context/auth/AuthContext";
import { useContext } from "react";
import ItemsTrabajador from "./ItemsTrabajador";
import ItemSupervisor from "./ItemSupervisor";
import ItemCapacitador from "./ItemCapacitador";

const menuItemStyles = {
  root: {
    fontSize: "16px",
    fontWeight: 400,
    color: "black",
    hover: {
      backgroundColor: "red",
      color: "#b6c8d9",
    },
  },

  SubMenuExpandIcon: {
    color: "#b6b7b9",
  },
};

/* 
const menuItemStyles2 = {
  root: {
    fontSize: '13px',
    fontWeight: 400,
  },
  icon: {
    color: themes[theme].menu.icon,
    [`&.${menuClasses.disabled}`]: {
      color: themes[theme].menu.disabled.color,
    },
  },
  SubMenuExpandIcon: {
    color: '#b6b7b9',
  },
  subMenuContent: ({ level }) => ({
    backgroundColor:
      level === 0
        ? hexToRgba(themes[theme].menu.menuContent, hasImage && !collapsed ? 0.4 : 1)
        : 'transparent',
  }),
  button: {
    [`&.${menuClasses.disabled}`]: {
      color: themes[theme].menu.disabled.color,
    },
    '&:hover': {
      backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, hasImage ? 0.8 : 1),
      color: themes[theme].menu.hover.color,
    },
  },
  label: ({ open }) => ({
    fontWeight: open ? 600 : undefined,
  }),
};
 */

const SidebarCustom = ({ children }) => {
  const { authState } = useContext(AuthContext);
  const rolUser = authState.user.rol;
  const { collapseSidebar, collapsed, broken, toggleSidebar } = useProSidebar();

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidebar breakPoint="md" width="240px" backgroundColor="#ffff">
        <Menu menuItemStyles={menuItemStyles}>
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-24 h-24 p-3 bg-white rounded-full">
              <img src={logoIsos} className="w-16" />
            </div>
          </div>
          {rolUser === "Trabajador" ? (
            <ItemsTrabajador />
          ) : rolUser === "Supervisor" ? (
            <ItemSupervisor />
          ) : rolUser === "Capacitador" ? (
            <ItemCapacitador />
          ) : (
            <ItemsAdmin />
          )}
        </Menu>
        <div className="absolute bottom-0 right-0 text-center">
          {!collapsed ? (
            <button onClick={() => collapseSidebar(true)}>
              <FontAwesomeIcon icon={faSquareCaretLeft} size="xl" />
            </button>
          ) : (
            <button onClick={() => collapseSidebar(false)}>
              <FontAwesomeIcon icon={faSquareCaretRight} size="xl" />
            </button>
          )}
        </div>
      </Sidebar>

      <main
        className=" bg-slate-100"
        style={{
          flexGrow: 1,
          backgroundColor: "bg-slate-100",
          width: "calc(100% - 240px)",
        }}
      >
        <NavBar broken={broken} toggleSidebar={toggleSidebar} />
        <div className="px-3">{children}</div>
      </main>
    </div>
  );
};

export default SidebarCustom;
