import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { getTrabajador } from "../../../services/trabajador";
import { getDescargaEmo } from "../../../services/emo";
import getEnvVaribles from "../../../config/getEnvVariables";

const ModalEvaluacionMedica = ({ closeModal }) => {

  const { VITE_API_URL } = getEnvVaribles();
  const [trabajador, setTrabajador] = useState({});

  const dataTrabajador = async () => {
    const id = JSON.parse(localStorage.getItem("userIsos")).idUsuario;
    const response = await getTrabajador(id);
    if (response.status === 200) {
      setTrabajador(response.data);
    }
  };

  useEffect(() => {
    dataTrabajador();
  }, []);

  const descargarEmo = async () => {
    const id = JSON.parse(localStorage.getItem("userIsos")).idUsuario;
    const response = await fetch(`${VITE_API_URL}/emo/descargar/${id}`);;

    // Obtén el contenido del archivo PDF y el tipo de contenido (Content-Type)
    const blob = await response.blob();

    // Genera una URL del Blob
    const url = URL.createObjectURL(blob);
  
    // Crea un enlace <a> para iniciar la descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = 'documento.pdf';
  
    // Simula un clic en el enlace para iniciar la descarga
    link.click();
  
    // Libera la URL del Blob
    URL.revokeObjectURL(url);
    closeModal()
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>
        {" "}
        <strong>DECLARACIÓN JURADA</strong>{" "}
      </h2>
      <p style={{ marginTop: "30px", textAlign: "justify" }}>
        Yo,{" "}
        <strong>
          {trabajador?.apellidoPaterno +
            " " +
            trabajador?.apellidoMaterno +
            " " +
            trabajador?.nombres}{" "}
        </strong>{" "}
        con documento de identidad N° <strong>{trabajador?.dni} </strong>,
        trabajador de la empresa{" "}
        <strong>{trabajador?.empresa?.nombreEmpresa} </strong>, Declaro bajo
        juramento que: - Acepto que mediante esta plataforma me entregaron los
        resultados de mi examen médico ocupacional y que estos son de carácter
        personal y confidencial, esto en cumplimiento de la normativa legal
        vigente en Seguridad y Salud en el Trabajo. (Ley 29783, DS 005-2012 TR Y
        RM Nº 312-2011-MINSA). Me afirmo y me ratifico en lo expresado, en señal
        de lo cual:
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <button className="btn btn-active btn-sm btn-accent gap-2 text-white" onClick={() =>descargarEmo()}>
          Aceptar
        </button>
        <button
          type="button"
          className="btn btn-active btn-sm btn-error  gap-2 text-white"
          onClick={closeModal}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalEvaluacionMedica;
