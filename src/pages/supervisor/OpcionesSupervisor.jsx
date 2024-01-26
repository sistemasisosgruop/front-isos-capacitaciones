import {
  faAward,
  faClipboard,
  faLaptop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "react-router-dom";

const OpcionesSupervisor = () => {
  return (
    <>
      <div
        className="flex gap-3 flex-col md:flex-row justify-center items-center h-full w-full md-w-10/12 lg:w-12/12 mx-auto"
        style={{ height: "90vh" }}
      >
        <div className="w-25">
          <Link to="../examenes">
            <div className="bg-white text-center p-5 rounded-2xl shadow-xl">
              <h3 className="font-bold text-sm mb-3">REPORTE DE EXAMENES</h3>
              <FontAwesomeIcon icon={faLaptop} size="3x" />
            </div>
          </Link>
        </div>
        <div className="w-25">
          <Link to="../certificados">
            <div className="bg-white text-center p-5 rounded-2xl shadow-xl">
              <h3 className="font-bold text-sm mb-3">
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

export default OpcionesSupervisor;
