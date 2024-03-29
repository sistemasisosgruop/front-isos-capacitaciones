import { Link } from "react-router-dom";
import { MenuItem, menuClasses } from "react-pro-sidebar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBuilding,faListOl, faChalkboardTeacher, faFileInvoice, faNotesMedical } from "@fortawesome/free-solid-svg-icons";

const ItemsTrabajador = () => {
  return (
    <>
      <MenuItem
        component={<Link to="./trabajador/capacitaciones" />}
        icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
      >
        Capacitaciones
      </MenuItem>
      <MenuItem
        component={<Link to="./trabajador/test" />}
        icon={<FontAwesomeIcon icon={faListOl} />}
      >
        Test
      </MenuItem>
      <MenuItem
        component={<Link to="./trabajador/evaluacion" />}
        icon={<FontAwesomeIcon icon={faNotesMedical} />}
      >
        Evaluación médica
      </MenuItem>
    </>
  );
};

export default ItemsTrabajador;
