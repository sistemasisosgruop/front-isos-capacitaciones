import logoIndex from "../../assets/img/logoIndex.png";
import logoIsos from "../../assets/img/logoallincode.png";
import { Modal } from "../../components/modal/Modal";
import useModals from "../../hooks/useModal";
import FormLogin from "./FormLogin";
import React, {
  useState,
} from "react";
import FormCertificados from "./components/formCertificados"
import FormSoporte from "./components/formSoporte"

const Index = () => {
  const [isOpen1, openModal1, closeModal1] = useModals();
  const [isOpen, openModal, closeModal] = useModals();
  const [descripcionModal, setDescripcionModal] = useState("");

  const handleValidarCertificados = (data) => {
    setDescripcionModal("Validad autenticacion de certificado");
    openModal1();
  };

  const handleSolicitarSoporte = (data) => {
    setDescripcionModal("Solicitud de Soporte");
    openModal();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-200">
      <div className="flex flex-col items-center md:flex-row">
        <div className="hidden md:block md:w-1/2">
          <img src={logoIndex} className="w-full" />
        </div>
        <div className="flex justify-center w-full md:w-1/2 relative"> {/* Añadido relative */}
          {/* Botones encima del div blanco */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
            <button
             onClick={handleValidarCertificados}
              className="bg-teal-600 text-white font-bold py-1 px-1 text-sm rounded hover:bg-teal-700 transition"
            >
              VALIDAR CERTIFICADOS
            </button>
            <button
              onClick={handleSolicitarSoporte}
              className="bg-teal-600 text-white font-bold py-1 px-1 text-sm rounded hover:bg-teal-700 transition"
            >
              SOLICITAR SOPORTE
            </button>
          </div>
          {/* Div blanco con el formulario */}
          <div className="w-full p-5 bg-white shadow-slate-300 md:w-3/5 mt-16">
            <figure className="mb-3">
              <img src={logoIsos} className="mx-auto w-28" />
            </figure>
            <FormLogin />
          </div>
          <Modal
          isOpen={isOpen1}
          openModal={openModal1}
          closeModal={closeModal1}
          size={"modal-lg"}
          title={descripcionModal}
          >
            <FormCertificados
              closeModal={closeModal1}
            />
          </Modal>
          <Modal
          isOpen={isOpen}
          openModal={openModal}
          closeModal={closeModal}
          size={"modal-lg"}
          title={descripcionModal}
          >
            <FormSoporte
              closeModal={closeModal}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Index;
