import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import Button from "./Button";
import { toast } from "react-toastify";

const ProgressBar = () => {
  const [progress, setProgress] = useState({ total: 0, completado: 0 });
  const [isGenerating, setIsGenerating] = useState(false);

  const startReportGeneration = async () => {
    setIsGenerating(true);
    await fetch("http://54.91.207.26/api/v1/reporte/generar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    updateProgress();
  };

  const updateProgress = async () => {
    const response = await fetch(
      "http://54.91.207.26/api/v1/reporte/progreso"
    );
    const data = await response.json();
    setProgress(data);

    if (data.completado < data.total) {
      setTimeout(updateProgress, 500); // Volver a consultar cada segundo
    } else {
        toast.success("Reportes creados con éxito!", {
            position: "bottom-right",
          });
      setIsGenerating(false);
    }
  };

  const percentage = progress.total
    ? (progress.completado / progress.total) * 100
    : 0;

  return (
    <div>
      <Button
        description={isGenerating ? "Generando..." : "Generar Reporte"}
        // icon={faPlus}
        event={startReportGeneration}
      />

      {isGenerating && (
        <div id="overlay">
          <div id="progressContainer">
            <div
              id="progressBar"
              style={{
                width: `${percentage}%`,
                height: "30px",
                backgroundColor: "#0E9488",
                borderRadius: "5px",
                animation: "progress-animation 2s linear infinite",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
