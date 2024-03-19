import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBuilding,
  faListOl,
  faChalkboardTeacher,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet } from "react-router-dom";
import "./styles.css";

const OpcionesAdmin = () => {
  return (
    <>
      <div className="w-full" style={{ height: "90vh" }}>
        <div className="flex justify-center items-center h-full">
          <div className="container-menu">
            <Link className="shadow-xl bg-white box-1 text-center p-5 rounded-2xl" to="../trabajadores">
                <h3 className="font-bold text-base md:text-lg mb-3">TRABAJADORES</h3>
                <FontAwesomeIcon icon={faUsers} size="3x" />
            </Link>
            <Link className="shadow-xl bg-white box-2 text-center p-5 rounded-2xl" to="../empresas">
              <h3 className="font-bold text-base md:text-lg mb-3">EMPRESAS</h3>
              <FontAwesomeIcon icon={faBuilding} size="3x" />
            </Link>
            <Link className="shadow-xl bg-white box-3 text-center p-5 rounded-2xl" to="../capacitaciones">
              <h3 className="font-bold text-base md:text-lg mb-3">CAPACITACIONES</h3>
              <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" />
            </Link>
            <Link className="shadow-xl bg-white box-4 text-center p-5 rounded-2xl" to="../test">
              <h3 className="font-bold text-base md:text-lg mb-3">TEST</h3>
              <FontAwesomeIcon icon={faListOl} size="3x" />
            </Link>
            <Link className="shadow-xl bg-white box-5 text-center p-5 rounded-2xl" to="../reportes/opciones">
              <h3 className="font-bold text-base md:text-lg mb-3">REPORTES</h3>
              <FontAwesomeIcon icon={faFileInvoice} size="3x" />
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default OpcionesAdmin;
