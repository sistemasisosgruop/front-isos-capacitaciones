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

const ItemSupervisor = () => {
  return (
    <>
      <MenuItem
        component={<Link to="./supervisor/capacitaciones" />}
        icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
      >
        Capacitaciones
      </MenuItem>
      <MenuItem
        component={<Link to="./supervisor/test" />}
        icon={<FontAwesomeIcon icon={faListOl} />}
      >
        Test
      </MenuItem>

      <MenuItem
        component={<Link to="./supervisor/certificados" />}
        icon={<FontAwesomeIcon icon={faFileInvoice} />}
      >
        Mis Certificados
      </MenuItem>
      <MenuItem
        component={<Link to="./supervisor/evaluacion" />}
        icon={<FontAwesomeIcon icon={faNotesMedical} />}
      >
        Evaluación médica
      </MenuItem>
      <MenuItem
        component={<Link to="./supervisor/constancia/opciones" />}
        icon={<FontAwesomeIcon icon={faFileInvoice} />}
      >
        Constancias y Envios
      </MenuItem>
      <MenuItem
        component={<Link to="./supervisor/reportes/opciones" />}
        icon={<FontAwesomeIcon icon={faClipboard} />}
      >
        Reportes
      </MenuItem>
    </>
  );
};

export default ItemSupervisor;
