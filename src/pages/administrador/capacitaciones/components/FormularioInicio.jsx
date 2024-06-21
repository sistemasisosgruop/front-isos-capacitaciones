import { useState } from "react";
import Button from "../../../../components/Button";
import { hideLoader, showLoader } from "../../../../utils/loader";
import validate from "./validateFormModal";
import { useForm } from "../../../../hooks/useForms";
import { toast } from "react-toastify";
import {
  getCapacitacion,
  patchCapacitaciones,
  postCapacitaciones,
} from "../../../../services/capacitacion";
import Select from "react-select";

const FormularioInicio = ({
  initialForm,
  empresasDb,
  validateGetPreguntas,
  addItem,
  updateRow,
  closeModal,
  userId,
  empresaId,
  rol
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formValidations = validate();

  //tipo de accion del formulario
  const action = initialForm.empresas === "" ? "ADD" : "UPDATE";

  const {
    id,
    nombre,
    instructor,
    fechaInicio,
    fechaCulminacion,
    urlVideo,
    horas,
    fechaAplazo,
    empresas,
    certificado,

    nombreValid,
    instructorValid,
    fechaInicioValid,
    fechaCulminacionValid,
    urlVideoValid,
    horasValid,
    fechaAplazoValid,
    empresasValid,
    certificadoValid,

    formState,
    isFormValid,
    onInputChange,
    onResetForm,
    setFormState,
  } = useForm(initialForm, formValidations);

  const handleForm = async (event, action) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) return;
    const preguntasCreadas = await validateGetPreguntas();
    if (!preguntasCreadas) {
      return toast.warning("Todos los preguntas deben llenadas correctamente", {
        position: "bottom-right",
      });
    } else {
      if (preguntasCreadas.length !== 5) {
        return toast.warning("el minimo de preguntas es 5", {
          position: "bottom-right",
        });
      }
    }

    const formatPregunta = {
      titulo: "Ejemplo de examen",
      preguntas: preguntasCreadas,
    };

    //formatemos empresas a [1,2...]
    const empresasFormat = formState.empresas.map((obj) => obj.value);
    
    const data = new FormData();

    data.append("nombre", formState.nombre);
    data.append("instructor", formState.instructor);
    data.append("fechaInicio", formState.fechaInicio);
    data.append("fechaCulminacion", formState.fechaCulminacion);
    fechaAplazo !== "" && data.append("fechaAplazo", formState.fechaAplazo);
    data.append("urlVideo", formState.urlVideo);
    data.append("certificado", formState.certificado);
    data.append("examen", JSON.stringify(formatPregunta));
    data.append("empresas", empresasFormat);
    data.append("horas", formState.horas);
    data.append("userId", userId);

    if (action === "ADD") {
      add(data);
    } else {
      update(data);
    }
  };

  const add = (data) => {
    showLoader();
    postCapacitaciones(data).then(({ data, message = null }) => {
      if (data) {
        getCapacitacion(data.id).then(({ data }) => {
          const { capacitacion } = data;
          // console.log(data)
          delete data.capacitacion;
          const dataFormat = { ...data, ...capacitacion };
          toast.success("Agregado con exito", {
            position: "bottom-right",
          });
          addItem(0, dataFormat);
        });

        closeModal();
        setFormSubmitted(false);
        onResetForm();
      } else {
        toast.error(message, {
          position: "bottom-right",
        });
      }
      hideLoader();
    });
  };

  const update = (data) => {
    showLoader();
    patchCapacitaciones(id, data).then(({ data, message = null }) => {
      if (data) {
        getCapacitacion(data.id).then(({ data }) => {
          const { capacitacion } = data;
          delete data.capacitacion;
          const dataFormat = { ...data, ...capacitacion };
          toast.success("Actualizado con exito", {
            position: "bottom-right",
          });
          updateRow(dataFormat);
        });

        closeModal();
        setFormSubmitted(false);
      } else {
        toast.error(message, {
          position: "bottom-right",
        });
      }
      hideLoader();
    });
  };

  const handleEmpresas = (values) => {
    formState.empresas = values;
    setFormState((valueForm) => ({ ...valueForm, formState }));
  };

  return (
    <form onSubmit={(event) => handleForm(event, action)}>
      <div className="flex flex-col gap-3 mb-2 md:flex-row">
        <div className="w-full md:w-2/4">
          <label htmlFor="nombre" className="font-semibold">
            Nombre de capacitación
          </label>
          <input type="hidden" defaultValue={"fds"} />
          <input
            type="text"
            name="nombre"
            id="nombre"
            className="w-full input input-bordered input-sm"
            value={nombre}
            onChange={onInputChange}
          />
          <input
            type="hidden"
            name="userId"
            id="userId"
            className="w-full input input-bordered input-sm"
            value={userId}
            onChange={onInputChange}
          />
          <input
            type="hidden"
            name="empresaId"
            id="empresaId"
            className="w-full input input-bordered input-sm"
            value={empresaId}
            onChange={onInputChange}
          />
          {!!nombreValid && formSubmitted && (
            <p className="text-sm text-red-700">{nombreValid}</p>
          )}
        </div>
        <div className="w-full md:w-2/4">
          <label htmlFor="ruc" className="font-semibold">
            Nombre de la empresa
          </label>
          <Select
            isMulti
            options={empresasDb}
            onChange={handleEmpresas}
            value={empresas}
            placeholder="Selecciona empresa"
          />
          {!!empresasValid && formSubmitted && (
            <p className="text-sm text-red-700">{empresasValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 mb-2 md:flex-row">
        <div className="w-full md:w-1/3">
          <label htmlFor="instructor" className="font-semibold">
            Nombre del instructor
          </label>
          <input
            type="text"
            name="instructor"
            id="instructor"
            className="w-full input input-bordered input-sm"
            value={instructor}
            onChange={onInputChange}
          />
          {!!instructorValid && formSubmitted && (
            <p className="text-sm text-red-700">{instructorValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="urlVideo" className="font-semibold">
            URL del video
          </label>
          <input
            type="url"
            name="urlVideo"
            id="urlVideo"
            className="w-full input input-bordered input-sm"
            value={urlVideo}
            onChange={onInputChange}
          />
          {!!urlVideoValid && formSubmitted && (
            <p className="text-sm text-red-700">{urlVideoValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="certificado" className="font-semibold">
            Firma del instructor
          </label>
          <input
            type="file"
            name="certificado"
            id="certificado"
            className="w-full file-input file-input-bordered file-input-sm"
            accept=".png, .jpg, .jpeg"
            onChange={onInputChange}
          />
          {!!certificadoValid && formSubmitted && (
            <p className="text-sm text-red-700">{certificadoValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 mb-2 md:flex-row">
        <div className="w-full md:w-1/4">
          <label htmlFor="horas" className="font-semibold">
            Horas
          </label>
          <input
            type="number"
            name="horas"
            id="horas"
            className="w-full input input-bordered input-sm"
            value={horas}
            onChange={onInputChange}
          />
          {!!horasValid && formSubmitted && (
            <p className="text-sm text-red-700">{horasValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="fechaInicio" className="font-semibold">
            Fecha de inicio
          </label>
          <input
            type="date"
            name="fechaInicio"
            id="fechaInicio"
            className="w-full input input-bordered input-sm"
            value={fechaInicio}
            onChange={onInputChange}
          />
          {!!fechaInicioValid && formSubmitted && (
            <p className="text-sm text-red-700">{fechaInicioValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="fechaCulminacion" className="font-semibold">
            Fecha de culminación
          </label>
          <input
            type="date"
            name="fechaCulminacion"
            id="fechaCulminacion"
            className="w-full input input-bordered input-sm"
            value={fechaCulminacion}
            onChange={onInputChange}
          />
          {!!fechaCulminacionValid && formSubmitted && (
            <p className="text-sm text-red-700">{fechaCulminacionValid}</p>
          )}
        </div>
        {action === "UPDATE" && (
          <div className="w-full md:w-1/4">
            <label htmlFor="fechaAplazo" className="font-semibold">
              Fecha de aplazo
            </label>
            <input
              type="date"
              name="fechaAplazo"
              id="fechaAplazo"
              className="w-full input input-bordered input-sm"
              value={fechaAplazo}
              onChange={onInputChange}
            />
            {!!fechaAplazoValid && formSubmitted && (
              <p className="text-sm text-red-700">{fechaAplazoValid}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-3">
        <Button description={action === "ADD" ? "Agregar" : "Guardar"} />
      </div>
    </form>
  );
};

export default FormularioInicio;
