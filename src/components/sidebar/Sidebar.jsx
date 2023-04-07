import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
  sidebarClasses,
  menuClasses,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBuilding,faListOl, faChalkboardTeacher, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import logoIsos from  '../../assets/img/logoIsos.svg';
import NavBar from "../NavBar";
import ItemsTrabajadores from "./ItemsTrabajador";
import ItemsAdmin from "./ItemsAdmin";

const menuItemStyles = {
  root: {
    fontSize: "15px",
    fontWeight: 400,
    color: "white",
    hover: {
      backgroundColor: "red",
      color: "#b6c8d9",
    },
  },
  /*   icon: {
    color: themes[theme].menu.icon,
    [`&.${menuClasses.disabled}`]: {
      color: themes[theme].menu.disabled.color,
    },
  }, */
  SubMenuExpandIcon: {
    color: "#b6b7b9",
  },
  /*   subMenuContent: ({ level }) => ({
    backgroundColor:
      level === 0
        ? hexToRgba(themes[theme].menu.menuContent, hasImage && !collapsed ? 0.4 : 1)
        : 'transparent',
  }), */
  /*   button: {
    [`&.${menuClasses.disabled}`]: {
      color: themes[theme].menu.disabled.color,
    },
    '&:hover': {
      backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, hasImage ? 0.8 : 1),
      color: themes[theme].menu.hover.color,
    },
  }, */
  /*   label: ({ open }) => ({
    fontWeight: open ? 600 : undefined,
  }), */
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
  const { collapseSidebar, collapsed, broken, toggleSidebar } = useProSidebar();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        breakPoint="md"
        width="200px"
        backgroundColor="#314AD3"
        /* image={img} */
        /*  rootStyles={{
          [`.${sidebarClasses.container}`]: {
            color: "black",
          },
        }} */
      >
        <Menu menuItemStyles={menuItemStyles}>
          <div className='flex justify-center'>
            <div className='w-24 h-24 bg-white flex justify-center items-center rounded-full p-5'>
              <img src={ logoIsos } className='w-16' />
            </div>
          </div>
          
          {/* <ItemsTrabajadores/> */}
          <ItemsAdmin/>
    
        </Menu>
        <div>
          {!collapsed ? (
            <button onClick={() => collapseSidebar(true)}>Collapse</button>
          ) : (
            <button onClick={() => collapseSidebar(false)}>Collapse</button>
          )}
        </div>
      </Sidebar>

      <main className='w-full bg-slate-100'>
      <NavBar/>
        <div style={{ color: "#44596e" }}>
          <div style={{ marginBottom: "2px" }}>
            {broken && (
              <button className="sb-button" onClick={() => toggleSidebar()}>
                Toggle
              </button>
            )}
          </div>
        </div>
        <div className="px-3">
        {children}
        </div>
      </main>
    </div>
  );
};

export default SidebarCustom;
