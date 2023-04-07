import { Link } from "react-router-dom";
import { MenuItem, menuClasses } from "react-pro-sidebar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBuilding,
  faListOl,
  faChalkboardTeacher,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";

const ItemsAdmin = () => {
  return (
    <>
      <MenuItem
        component={<Link to="./admin/trabajadores" />}
        icon={<FontAwesomeIcon icon={faUsers} />}
      >
        Trabajadores
      </MenuItem>
      <MenuItem
        component={<Link to="./admin/empresas" />}
        icon={<FontAwesomeIcon icon={faBuilding} />}
      >
        Empresas
      </MenuItem>
      <MenuItem
        component={<Link to="./admin/capacitaciones" />}
        icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
      >
        Capacitaciones
      </MenuItem>
      <MenuItem
        component={<Link to="./admin/test" />}
        icon={<FontAwesomeIcon icon={faListOl} />}
      >
        Test
      </MenuItem>
      <MenuItem
        component={<Link to="./admin/reportes" />}
        icon={<FontAwesomeIcon icon={faFileInvoice} />}
      >
        Reportes
      </MenuItem>
    </>
  );
};

export default ItemsAdmin;
