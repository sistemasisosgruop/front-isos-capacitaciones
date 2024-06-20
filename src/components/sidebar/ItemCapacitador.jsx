import { Link } from "react-router-dom";
import { MenuItem, menuClasses } from "react-pro-sidebar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBuilding,
  faListOl,
  faChalkboardTeacher,
  faFileInvoice,
  faNotesMedical,
  faClipboard
} from "@fortawesome/free-solid-svg-icons";

const ItemCapacitador = () => {
  return (
    <>
      <MenuItem
        component={<Link to="./capacitador/capacitaciones" />}
        icon={<FontAwesomeIcon icon={faBuilding} />}
      >
        Lista Capacitaciones
      </MenuItem>
      <MenuItem
        component={<Link to="./capacitador/capacitador" />}
        icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
      >
        Capacitaciones
      </MenuItem>
      <MenuItem
        component={<Link to="./capacitador/test" />}
        icon={<FontAwesomeIcon icon={faListOl} />}
      >
        Test
      </MenuItem>
      <MenuItem
        component={<Link to="./capacitador/evaluacion" />}
        icon={<FontAwesomeIcon icon={faNotesMedical} />}
      >
        Evaluación médica
      </MenuItem>
      <MenuItem
        component={<Link to="./capacitador/reportes/opciones" />}
        icon={<FontAwesomeIcon icon={faClipboard} />}
      >
        Reportes
      </MenuItem>
    </>
  );
};

export default ItemCapacitador;
