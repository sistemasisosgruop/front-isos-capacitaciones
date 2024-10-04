import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { formatDateYMD } from "../../../utils/formtDate";
import { hideLoader, showLoader } from "../../../utils/loader";
import validate from "./validateFormModal";
import { useForm } from "../../../hooks/useForms";
import { toast } from "react-toastify";
import {
  getTrabajador,
  patchTrabajador,
  postTrabajador,
} from "../../../services/trabajador";
import dayjs from "dayjs";
import { getTrabajadorEmo, updateTrabajadorEmo } from "../../../services/emo";

const FormularioTrabajador = ({
  initialForm,
  addItem,
  updateRow,
  closeModal,
  empresas,
  getTrabajadorEmo,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [dataTrabajador, setDataTrabajador] = useState({
    clinica: "",
    fecha_lectura: "",
    fecha_examen: "",
    fecha_vencimiento: "",
    condicion_aptitud: "",
    estado: "",
  });
  const formValidations = validate();
  //tipo de accion del formulario

  useEffect(() => {
    setDataTrabajador({
      fecha_lectura: initialForm?.fecha_lectura || "",
      clinica: initialForm?.clinica || "",
      fecha_examen: initialForm?.fecha_examen || "",
      fecha_vencimiento: initialForm?.fecha_vencimiento || "",
      condicion_aptitud: initialForm?.condicion_aptitud || "",
      estado: initialForm?.estado || "",
    });
  }, [initialForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataTrabajador((prevState) => ({ ...prevState, [name]: value }));
  };

  const update = async (e) => {
    e.preventDefault();
    // showLoader();
    // console.log(dataTrabajador)

    const response = await updateTrabajadorEmo(initialForm.dni, dataTrabajador);
    if (response) {
      toast.success("Actualizado con exito", {
        position: "bottom-right",
      });
      getTrabajadorEmo();
      closeModal();
    } else {
      toast.error(message, {
        position: "bottom-right",
      });
      // hideLoader();
    }
  };

  return (
    <form onSubmit={update}>
      <div className="flex flex-col w-full gap-3 md:w-full">
        <div className="w-full ">
          <label htmlFor="nombres" className="font-semibold">
            Fecha examen médico
          </label>
          <input type="hidden" defaultValue={"fds"} />
          <input
            type="date"
            name="fecha_examen"
            className="w-full input input-bordered input-sm"
            value={
              dataTrabajador.fecha_examen
                ? dayjs(dataTrabajador.fecha_examen, "DD-MM-YYYY").format(
                    "YYYY-MM-DD"
                  )
                : ""
            }
            onChange={handleChange}
          />
          {/* {!!nombresValid && formSubmitted && (
            <p className="text-sm text-red-700">{nombresValid}</p>
          )} */}
        </div>
        <div className="w-full ">
          <label htmlFor="apellidoPaterno" className="font-semibold">
            Condición de aptitud
          </label>
          <br />
          <select
            className="w-full select select-bordered select-sm"
            name="condicion_aptitud"
            id=""
            value={dataTrabajador.condicion_aptitud}
            onChange={handleChange}
          >
            <option value="APTO">APTO</option>
            <option value="APTO CON RESTRICCIONES">APTO CON RESTRICCIONES</option>
            <option value="NO APTO">NO APTO</option>
          </select>
        </div>
        <div className="w-full ">
          <label htmlFor="apellidoPaterno" className="font-semibold">
            Clínica
          </label>
          <input
            type="text"
            name="clinica"
            className="w-full input input-bordered input-sm"
            value={dataTrabajador.clinica}
            onChange={handleChange}
          />
          {/* {!!apellidoMaternoValid && formSubmitted && (
            <p className="text-sm text-red-700">{apellidoMaternoValid}</p>
          )} */}
        </div>

        <div className="w-full ">
          <label htmlFor="dni" className="font-semibold">
            Fecha de lectura Emo
          </label>
          <input
            type="date"
            name="fecha_lectura"
            className="w-full input input-bordered input-sm"
            value={
              dataTrabajador.fecha_lectura
                ? dayjs(dataTrabajador.fecha_lectura, "DD-MM-YYYY").format(
                    "YYYY-MM-DD"
                  )
                : ""
            }
            onChange={handleChange}
          />
          {/* {!!dniValid && formSubmitted && (
            <p className="text-sm text-red-700">{dniValid}</p>
          )} */}
        </div>

        <div className="w-full ">
          <label htmlFor="fecha_vencimiento" className="font-semibold">
            Fecha de Vencimiento Emo
          </label>
          <input
            type="date"
            name="fecha_vencimiento"
            className="w-full input input-bordered input-sm"
            value={
              dataTrabajador.fecha_vencimiento
                ? dayjs(dataTrabajador.fecha_vencimiento, "DD-MM-YYYY").format(
                    "YYYY-MM-DD"
                  )
                : ""
            }
            onChange={handleChange}
          />
          {/* {!!dniValid && formSubmitted && (
            <p className="text-sm text-red-700">{dniValid}</p>
          )} */}
        </div>
      </div>
      <div className="w-full mt-2">
          <label htmlFor="estado" className="font-semibold">
            Estado
          </label>
          <br />
          <select
            className="w-full select select-bordered select-sm"
            name="estado"
            id=""
            value={dataTrabajador.estado}
            onChange={handleChange}
          >
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="EMITIDO">EMITIDO</option>
            <option value="EMITIDO Y ENVIADO">EMITIDO Y ENVIADO</option>
          </select>
        </div>
      <div className="flex justify-end mt-4">
        <Button description={"Guardar"} />
      </div>
    </form>
  );
};

export default FormularioTrabajador;
