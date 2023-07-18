import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListOl,
  faChalkboardTeacher,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import ModalEvaluacionMedica from "./ModalEvaluacionMedica";
import { Modal } from "../../../components/modal/Modal";
const EvaluacionMedica = () => {
  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className="" style={{ height: "90vh" }}>
      <div
        className="bg-white p-3 w-full h-full flex flex-col "
        
      >
        <h2 className="font-bold text-2xl mb-3">EVALUACIÓN MÉDICA</h2>
        <div className="flex flex-grow justify-center items-center" >
          <div className="bg-white text-center p-5 rounded-2xl shadow-xl w-full md:w-1/4" style={{cursor:"pointer"}} onClick={openModal}>
            <h3 className="font-bold text-lg mb-3">
              Descargar Evaluación Medica
            </h3>
            <FontAwesomeIcon icon={faDownload} size="3x" />
          </div>
        </div>
      </div>
      <Modal
        isOpen={modal}
        openModal={modal}
        closeModal={closeModal}
        size={"modal-sm"}
        title=""
      >
        <ModalEvaluacionMedica closeModal={closeModal}/>
      </Modal>
    </div>
  );
};

export default EvaluacionMedica;
