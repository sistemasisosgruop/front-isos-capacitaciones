import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListOl,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";

const OpcionesAdmin = () => {
  return (
    <div className="" style={{ height: "90vh" }}>
      <div className="flex gap-3 flex-col md:flex-row justify-center items-center h-full w-full md-w-6/12 lg:w-4/12 mx-auto">
        <div className="bg-white text-center p-5 rounded-2xl shadow-xl w-3/4 md:w-1/2">
          <h3 className="font-bold text-lg mb-3">CAPACITACIONES</h3>
          <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" />
        </div>
        <div className="bg-white text-center p-5 rounded-2xl shadow-xl w-3/4 md:w-1/2">
          <h3 className="font-bold text-lg mb-3">TEST</h3>
          <FontAwesomeIcon icon={faListOl} size="3x" />
        </div>
      </div>
    </div>
  );
};

export default OpcionesAdmin;
