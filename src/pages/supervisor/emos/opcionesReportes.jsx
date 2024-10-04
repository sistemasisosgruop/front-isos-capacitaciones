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

      <div className="w-full h-full p-5 bg-white rounded-md">
                  <h2 className="mb-3 text-2xl font-bold">Constancias y Envios de Resultado de Examén Médico Ocupacional</h2>
        <div className="w-full h-full">
          
          <VisualizarRegistroEmo/>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default OpcionesReportes;
