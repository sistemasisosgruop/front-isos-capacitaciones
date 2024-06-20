import {
  faAward,
  faClipboard,
  faLaptop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "react-router-dom";

const OpcionesCapacitador = () => {
  return (
    <>
      <div
        className="flex flex-col items-center justify-center w-full h-full gap-3 mx-auto md:flex-row md-w-10/12 lg:w-12/12"
        style={{ height: "90vh" }}
      >
        <div className="w-25">
          <Link to="../examenes">
            <div className="p-5 text-center bg-white shadow-xl rounded-2xl">
              <h3 className="mb-3 text-sm font-bold">REPORTE DE EXAMENES</h3>
              <FontAwesomeIcon icon={faLaptop} size="3x" />
            </div>
          </Link>
        </div>
        <div className="w-25">
          <Link to="../certificados">
            <div className="p-5 text-center bg-white shadow-xl rounded-2xl">
              <h3 className="mb-3 text-sm font-bold">
                REPORTE DE CERTIFICADOS
              </h3>
              <FontAwesomeIcon icon={faAward} size="3x" />
            </div>
          </Link>
        </div>

      </div>
      <Outlet />
    </>
  );
};

export default OpcionesCapacitador;
