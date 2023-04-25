import { PDFDownloadLink } from "@react-pdf/renderer";
import Certificado from "./Certificado";

const TarjetasCapacitaciones = ({ title, date, openModal }) => {
  return (
    <div className="w-full bg-slate-100 p-3 border-l-8 border-teal-600 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-sm md:text-lg">{title}</h2>
        <div className="badge badge-accent bg-teal-600 text-white">
          Aprobado
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="flex w-full lg:w-1/2 gap-y-3">
          <div className="w-1/2 lg:w-2/5">
            <p className="font-semibold">Capacitación</p>
            <p className="font-semibold">Evaluación</p>
          </div>
          <div className="w-1/2 lg:w-3/5">
            <div className="badge badge-outline text-blue-500 cursor-pointer block mb-2">
              Dar capacitación
            </div>
            <div
              className="badge badge-outline text-blue-500 cursor-pointer block"
              onClick={openModal}
            >
              Dar evaluación
            </div>
          </div>
        </div>

        <div className="flex w-full lg:w-1/2">
          <div className="w-1/2 lg:w-2/5">
            <p className="font-semibold">Certificado</p>
            <p className="font-semibold">Fecha</p>
          </div>
          <div className="w-1/2 lg:w-3/5">
            <div className="badge badge-outline text-blue-500 cursor-pointer block mb-2">
              {/* <PDFDownloadLink
                document={<Certificado />}
                fileName="somename.pdf"
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Cargando..." : "Ver certificado"
                }
              </PDFDownloadLink> */}
            </div>
            <p>{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjetasCapacitaciones;
