import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { formatDateYMD } from "../../../utils/formtDate";
import { hideLoader, showLoader } from "../../../utils/loader";
import validate from "../emos/validateFormModal";
import { useForm } from "../../../hooks/useForms";
import { toast } from "react-toastify";
import {
  getTrabajador,
  patchTrabajador,
  postTrabajador,
} from "../../../services/trabajador";
import dayjs from "dayjs";
import { getTrabajadorEmo, updateTrabajadorEmo } from "../../../services/emo";

const FormularioEnvios = ({
  initialForm,
  addItem,
  updateRow,
  closeModal,
  empresas,
  getTrabajadorEmo,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [dataTrabajador, setDataTrabajador] = useState({
    celular: "",
    fecha_envio: "",
  });
  const formValidations = validate();
  //tipo de accion del formulario

  useEffect(() => {
    setDataTrabajador({
      celular: initialForm?.celular || "",
      fecha_envio: initialForm?.fecha_envio || "",
    });
  }, [initialForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataTrabajador((prevState) => ({ ...prevState, [name]: value }));
  };

  const update = async (e) => {
    e.preventDefault();
    // showLoader();

    const response = await updateTrabajadorEmo(initialForm.dni, dataTrabajador);
    if (response) {
      toast.success("Enviado con exito", {
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
          <label htmlFor="celular" className="font-semibold">
            Número de Celular
          </label>
          {/* <input type="hidden" defaultValue={"fds"} /> */}
          <input
            type="text"
            name="celular"
            className="w-full input input-bordered input-sm"
            value={
              dataTrabajador.celular
                ? dataTrabajador.celular
                : ""
            }
            onChange={handleChange}
          />
          {/* {!!nombresValid && formSubmitted && (
            <p className="text-sm text-red-700">{nombresValid}</p>
          )} */}
        </div>

        <div className="w-full ">
          <label htmlFor="dni" className="font-semibold">
            Fecha de Envio Emo
          </label>
          <input
            type="date"
            name="fecha_lectura"
            className="w-full input input-bordered input-sm"
            value={
              dataTrabajador.fecha_envio
                ? dayjs(dataTrabajador.fecha_envio, "DD-MM-YYYY").format(
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
      <div className="flex justify-end mt-4">
        <Button description={"Enviar por Whatsapp"} />
      </div>
    </form>
  );
};

export default FormularioEnvios;
