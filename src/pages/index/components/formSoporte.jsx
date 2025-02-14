import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { getEmpresas } from "../../../services/empresa"; // API para obtener empresas
import { postSolicitud } from "../../../services/solicitud";

const FormSoporte = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    correo: "",
    telefono: "",
    empresa: null,
    captura: null,
    mensaje: "",
  });

  const [empresas, setEmpresas] = useState([]); // Estado para empresas

  // Obtener empresas desde la API
  const fetchEmpresas = async () => {
    try {
      const response = await getEmpresas();
      if (response.status === 200) {
        // Mapear la respuesta para obtener el formato { value, label }
        const empresasFormateadas = response.data.map((empresa) => ({
          value: empresa.id, // ID como valor del select
          label: empresa.nombreEmpresa, // Nombre visible en el select
        }));
        setEmpresas(empresasFormateadas);
      }
    } catch (error) {
      toast.error("Error cargando empresas");
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmpresaChange = (selectedOption) => {
    setFormData({ ...formData, empresa: selectedOption });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convertir la imagen a base64
        setFormData({ ...formData, captura: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Obtener empresas desde la API
  const postSolicitudApi = async () => {
    try {
      const response = await postSolicitud(formData);
      if (response.status === 200) {
        toast.success("Solicitud enviada exitosamente");
        // Limpiar el formulario después de la solicitud exitosa
        setFormData({
          nombre: "",
          dni: "",
          correo: "",
          telefono: "",
          empresa: null,
          captura: null,
          mensaje: "",
        });
      }
    } catch (error) {
      toast.error("Error cargando empresas");
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    postSolicitudApi()
    closeModal();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Solicitud de Soporte</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">DNI</label>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Empresa</label>
          <Select
            options={empresas}
            onChange={handleEmpresaChange}
            value={formData.empresa}
            placeholder="Seleccione una empresa..."
            className="w-full text-sm"
            isSearchable
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Captura de Pantalla</label>
          <input
            type="file"
            name="captura"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Mensaje</label>
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-sm h-24"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-60 bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
};

export default FormSoporte;
