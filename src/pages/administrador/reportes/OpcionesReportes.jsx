import { useState } from "react";
import {
  faAward,
  faClipboard,
  faLaptop,
  faFileAlt, // Icono para Reportes de Recuperación
  faFolderOpen, // Icono para desplegar tests
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "react-router-dom";

const OpcionesReportes = () => {
  const [mostrarTests, setMostrarTests] = useState(false);

  const tests = [
    { nombre: "Test de Epworth", ruta: "../test-epworth" },
    { nombre: "Test de Pittsburgh", ruta: "../test-pittsburgh" },
    { nombre: "Test Nórdico", ruta: "../test-nordico" },
    { nombre: "Test de SQR", ruta: "../test-sqr" },
    { nombre: "Test de ISTAS 21", ruta: "../test-istas21" },
    { nombre: "Test de MBR Inventario", ruta: "../test-mbr" },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center py-10 w-full md:w-10/12 lg:w-12/12 mx-auto">
        {/* Contenedor de Reportes */}
        <div className="flex flex-wrap gap-2 justify-center items-center w-full">
          {/* Primera Fila */}
          <div className="w-25">
            <Link to="../asistencias">
              <div className="bg-white text-center p-5 rounded-2xl shadow-xl">
                <h3 className="font-bold text-sm mb-3">REPORTE DE ASISTENCIAS</h3>
                <FontAwesomeIcon icon={faClipboard} size="3x" />
              </div>
            </Link>
          </div>
          <div className="w-25">
            <Link to="../examenes">
              <div className="bg-white text-center p-5 rounded-2xl shadow-xl">
                <h3 className="font-bold text-sm mb-3">REPORTE DE EXÁMENES</h3>
                <FontAwesomeIcon icon={faLaptop} size="3x" />
              </div>
            </Link>
          </div>
          <div className="w-25">
            <Link to="../certificados">
              <div className="bg-white text-center p-5 rounded-2xl shadow-xl">
                <h3 className="font-bold text-sm mb-3">REPORTE DE CERTIFICADOS</h3>
                <FontAwesomeIcon icon={faAward} size="3x" />
              </div>
            </Link>
          </div>
          <div className="w-25">
            <Link to="../emos">
              <div className="bg-white text-center p-5 rounded-2xl shadow-xl">
                <h3 className="font-bold text-sm mb-3">
                  REPORTE DE DESCARGAS DE EMOS
                </h3>
                <FontAwesomeIcon icon={faClipboard} size="3x" />
              </div>
            </Link>
          </div>
        </div>

        {/* Segunda Fila */}
        <div className="flex flex-wrap gap-2 justify-center items-center w-full mt-5">
          <div className="w-25">
            <Link to="../recuperacion">
              <div className="bg-white text-center p-5 rounded-2xl shadow-xl">
                <h3 className="font-bold text-sm mb-3">REPORTES DE RECUPERACIÓN</h3>
                <FontAwesomeIcon icon={faFileAlt} size="3x" />
              </div>
            </Link>
          </div>

          <div className="w-25 cursor-pointer" onClick={() => setMostrarTests(!mostrarTests)}>
            <div className="bg-white text-center p-5 rounded-2xl shadow-xl">
              <h3 className="font-bold text-sm mb-3">
                REPORTES DE TEST {mostrarTests ? "▲" : "▼"}
              </h3>
              <FontAwesomeIcon icon={faFolderOpen} size="3x" />
            </div>
          </div>
        </div>

        {/* Lista de Tests (Aparece debajo) */}
        {mostrarTests && (
          <div className="flex flex-wrap gap-2 justify-center items-center mt-5">
            {tests.map((test, index) => (
              <div key={index} className="w-25">
                <Link to={test.ruta}>
                  <div className="bg-white text-center p-5 rounded-2xl shadow-xl">
                    <h3 className="font-bold text-sm mb-3">{test.nombre}</h3>
                    <FontAwesomeIcon icon={faClipboard} size="2x" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Outlet />
    </>
  );
};

export default OpcionesReportes;
