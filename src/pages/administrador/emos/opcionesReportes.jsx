import {
  faAward,
  faClipboard,
  faLaptop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import VisualizarRegistroEmo from "./VisualizarRegistroEmo";

const OpcionesReportes = () => {
  const [activeTab, setActiveTab] = useState("visualizar");

  return (
    <>

      <div className="w-full h-full bg-white rounded-md p-5">
                  <h2 className="font-bold text-2xl mb-3">Constancia de resultado de examen Médico</h2>
        <div className="w-full h-full">
          
          <VisualizarRegistroEmo/>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default OpcionesReportes;
