import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListOl,
  faChalkboardTeacher,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

const opcionesTrabajador = () => {
  return (
    <div className="" style={{ height: "90vh" }}>
      <div className="flex gap-3 flex-col md:flex-row justify-center items-center h-full w-full md-w-6/12 lg:w-6/12 mx-auto">
        <Link
          to="../capacitaciones"
          className="bg-white text-center p-5 rounded-2xl shadow-xl w-3/4 md:w-1/2"
        >
          <h3 className="font-bold text-md mb-3">Capacitaciones</h3>
          <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" />
        </Link>
        <Link
          to="../test"
          className="bg-white text-center p-5 rounded-2xl shadow-xl w-3/4 md:w-1/2"
        >
          <h3 className="font-bold text-md mb-3">Test</h3>
          <FontAwesomeIcon icon={faListOl} size="3x" />
        </Link>
        <Link
          to="../evaluacion"
          className="bg-white text-center p-5 rounded-2xl shadow-xl w-3/4 md:w-1/2"
        >
          <h3 className="font-bold text-md mb-3">Evaluación médica</h3>
          <FontAwesomeIcon icon={faDownload} size="3x" />
        </Link>
        <Link
          to="../certificados"
          className="bg-white text-center p-5 rounded-2xl shadow-xl w-3/4 md:w-1/2"
        >
          <h3 className="font-bold text-md mb-3">Mis certificados</h3>
          <FontAwesomeIcon icon={faDownload} size="3x" />
        </Link>
      </div>
    </div>
  );
};

export default opcionesTrabajador;
