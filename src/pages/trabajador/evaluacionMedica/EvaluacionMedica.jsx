import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { getEmoTrabajador } from "../../../services/emo";
import ModalEvaluacionMedica from "./ModalEvaluacionMedica";
import { Modal } from "../../../components/modal/Modal";

const EvaluacionMedica = () => {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("userIsos"));
      if (user?.dni) {
        getEmoTrabajador(user.dni)
          .then(({ data }) => {
            if (data?.data) setData(data.data);
          })
          .catch((error) => console.error("Error al obtener la evaluación médica:", error));
      }
    } catch (error) {
      console.error("Error al leer el usuario del localStorage:", error);
    }
  }, []);

  return (
    <div className="h-[90vh]">
      <div className="bg-white p-5 h-full flex flex-col">
        <h2 className="font-bold text-2xl mb-5">EVALUACIÓN MÉDICA</h2>

        {/* Fechas de evaluación */}
        <div className="mt-10 space-y-5">
          <p className="font-bold text-lg">
            Fecha de Inicio:{" "}
            <span className="text-green-500">{data?.[0]?.fecha_examen || "No disponible"}</span>
          </p>
          <p className="font-bold text-lg">
            Fecha de Control:{" "}
            <span className="text-red-600">{data?.[0]?.fecha_vencimiento || "No disponible"}</span>
          </p>
        </div>

        {/* Botón de descarga */}
        <div className="flex justify-center items-center mt-20">
          <button
            className="bg-white text-center p-5 rounded-2xl shadow-xl w-full md:w-1/4 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => setModal(true)}
          >
            <h3 className="font-bold text-lg mb-3">Descargar Evaluación Médica</h3>
            <FontAwesomeIcon icon={faDownload} size="3x" />
          </button>
        </div>

        {/* Secciones de Recomendaciones y Controles */}
        <div className="mt-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
          {[
            { title: "Recomendaciones", content: data?.[0]?.recomendaciones, color: "bg-teal-600" },
            { title: "Controles", content: data?.[0]?.controles, color: "bg-teal-600" },
          ].map(({ title, content, color }, index) => (
            <div key={index} className="relative flex">
              <div className={`${color} w-3 rounded-l-lg`}></div>
              <div className="bg-white p-5 rounded-r-lg shadow-md flex-1">
                <h3 className="font-bold text-lg mb-3">{title}:</h3>
                <p className="text-gray-600">{content || "No disponible"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modal} closeModal={() => setModal(false)} size="modal-sm">
        <ModalEvaluacionMedica closeModal={() => setModal(false)} />
      </Modal>
    </div>
  );
};

export default EvaluacionMedica;
