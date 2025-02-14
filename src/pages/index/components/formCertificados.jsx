import { useState } from "react";
import { toast } from "react-toastify";
import { getCapacitacionCodigo } from "../../../services/capacitacion";

const FormCertificados = ({ closeModal }) => {
  const [codigo, setCodigo] = useState("");
  const [certificado, setCertificado] = useState(null);

  const getDataTrabajador = async () => {
    if (!codigo.trim()) {
      toast.warn("Ingrese un código de certificado", { position: "top-right" });
      return;
    }

    try {
      const response = await getCapacitacionCodigo(codigo);
      if (response.status === 200) {
        setCertificado(response.data);
        toast.success("Certificado encontrado", { position: "top-right" });
      } else {
        setCertificado(null);
        toast.error("Certificado no encontrado", { position: "top-right" });
      }
    } catch (error) {
      setCertificado(null);
      toast.error("Error al buscar certificado", { position: "top-right" });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-center mb-6">
        Validar Autenticidad del Certificado
      </h2>

      {/* Formulario */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          placeholder="CODIGO DE CERTIFICADO"
          className="border rounded-md p-2 w-60 text-sm focus:ring-2 focus:ring-teal-600 uppercase text-center"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button
          onClick={getDataTrabajador}
          className="bg-teal-600 text-white font-bold py-2 px-4 text-sm rounded hover:bg-teal-700 transition"
        >
          Consultar
        </button>
      </div>

      <p className="text-gray-500 text-center text-sm mb-4">
        Los certificados son validados hasta 1 año de vigencia
      </p>

      {/* Resultado */}
      {certificado && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-1">Código de Certificado</th>
                <th className="border px-3 py-1">Código de Capacitación</th>
                <th className="border px-3 py-1">Capacitación</th>
                <th className="border px-3 py-1">Fecha</th>
                <th className="border px-3 py-1">Duración</th>
                <th className="border px-3 py-1">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-1 text-center">{certificado.codigoCertificado}</td>
                <td className="border px-3 py-1 text-center">{certificado.codigoCapacitacion}</td>
                <td className="border px-3 py-1 text-center">{certificado.capacitacion}</td>
                <td className="border px-3 py-1 text-center">{certificado.fecha}</td>
                <td className="border px-3 py-1 text-center">{certificado.duracion}</td>
                <td
                  className={`border px-3 py-1 text-center font-bold ${
                    certificado.estado ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {certificado.estado ? "VÁLIDO" : "INVÁLIDO"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormCertificados;
