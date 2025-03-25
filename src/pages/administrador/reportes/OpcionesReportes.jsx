import { useState } from "react";
import {
  faAward,
  faClipboard,
  faLaptop,
  faFileAlt,
  faFolderOpen,
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
      <div className="min-h-screen flex flex-col items-center justify-center py-10 w-full md:w-10/12 lg:w-8/12 mx-auto">
        {/* 📌 Contenedor de Reportes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-5">
          {/* 📌 Primera Fila */}
          <ReportCard title="REPORTE DE ASISTENCIAS" icon={faClipboard} link="../asistencias" />
          <ReportCard title="REPORTE DE EXÁMENES" icon={faLaptop} link="../examenes" />
          <ReportCard title="REPORTE DE CERTIFICADOS" icon={faAward} link="../certificados" />
          <ReportCard title="REPORTE DE DESCARGAS DE EMOS" icon={faClipboard} link="../emos" />
          <ReportCard title="REPORTES DE RECUPERACIÓN" icon={faFileAlt} link="../recuperacion" />
          <ReportCard title="REPORTES DE EMISIÓN DE CONSTANCIA" icon={faFileAlt} link="../constancias" />

          {/* 📌 Reportes de Tests */}
          <div 
            className="cursor-pointer bg-white text-center p-5 rounded-2xl shadow-lg hover:shadow-xl transition"
            onClick={() => setMostrarTests(!mostrarTests)}
          >
            <h3 className="font-bold text-sm mb-3">
              REPORTES DE TEST {mostrarTests ? "▲" : "▼"}
            </h3>
            <FontAwesomeIcon icon={faFolderOpen} size="3x" className="text-gray-600" />
          </div>
        </div>

        {/* 📌 Lista de Tests (Aparece con animación) */}
        {mostrarTests && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-5 mt-5 transition-all duration-500">
            {tests.map((test, index) => (
              <ReportCard key={index} title={test.nombre} icon={faClipboard} link={test.ruta} />
            ))}
          </div>
        )}
      </div>

      <Outlet />
    </>
  );
};

/* 📌 Componente reutilizable para reportes */
const ReportCard = ({ title, icon, link }) => {
  return (
    <Link to={link} className="w-full">
      <div className="bg-white text-center p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all">
        <h3 className="font-bold text-sm mb-3">{title}</h3>
        <FontAwesomeIcon icon={icon} size="3x" className="text-gray-600" />
      </div>
    </Link>
  );
};

export default OpcionesReportes;
