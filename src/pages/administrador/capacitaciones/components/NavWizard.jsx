import React from "react";
import { useState } from "react";

const NavWizard = ({ goToNamedStep }) => {
  const [active, setactive] = useState("inicio");

  const goToPreguntas = () => {
    goToNamedStep("preguntas");
    setactive("preguntas");
  };

  const goToInicio = () => {
    goToNamedStep("inicio");
    setactive("inicio");
  };
  return (
    <ul className="flex flex-col md:flex-row w-full gap-3 cursor-pointer">
      <li
        className={`w-full text-lg font-bold  px-5 py-2 rounded-lg flex items-center gap-5 
        ${active === "inicio" && "bg-slate-200"}`}
        onClick={goToInicio}
      >
        <div className="bg-teal-600 w-10 h-10 rounded-full flex justify-center items-center text-white">
          1
        </div>
        <div>Inicio</div>
      </li>
      <li
        className={`w-full text-lg font-bold  px-5 py-2 rounded-lg flex items-center gap-5 
        ${active === "preguntas" && "bg-slate-200"}`}
        onClick={goToPreguntas}
      >
        <div className="bg-teal-600 w-10 h-10 rounded-full flex justify-center items-center text-white">
          2
        </div>
        <div>Preguntas</div>
      </li>
    </ul>
  );
};

export default NavWizard;
