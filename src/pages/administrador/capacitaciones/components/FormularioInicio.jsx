import { useState } from "react";
import validate from "./validateFormModal";
import { useForm } from "../../../../hooks/useForms";
import { toast } from "react-toastify";
import Button from "../../../../components/Button";
import { postCapacitaciones } from "../../../../services/capacitacion";

import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const FormularioInicio = ({
  initialForm,
  empresasDb,
  validateGetPreguntas,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formValidations = validate();
  //tipo de accion (Event)
  const action = initialForm.empresas === "" ? "ADD" : "UPDATE";

  const {
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
    }
    const formatPregunta = {
      titulo: "Ejemplo de examen",
      preguntas: preguntasCreadas,
    };
    const data = new FormData();

    data.append("nombre", formState.nombre);
    data.append("instructor", formState.instructor);
    data.append("fechaInicio", formState.fechaInicio);
    data.append("fechaCulminacion", formState.fechaCulminacion);
    data.append("urlVideo", formState.urlVideo);
    data.append("certificado", formState.certificado);
    data.append("examen", JSON.stringify(formatPregunta));
    data.append("empresas", formState.empresas);
    data.append("horas", 12);
    // Display the key/value pairs
    /*   for (const pair of data.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    } */

    if (action === "ADD") {
      add(data);
    } else {
      update(data);
    }
  };

  const add = (data) => {
    postCapacitaciones(data).then((res) => {
      console.log("res", res);
      const { data } = res;
      if (data) {
        const { createdAt, ...newrowData } = res.data;
        toast.success("Agregado con exito", {
          position: "bottom-right",
        });
        closeModal();
        addItem(0, newrowData);
        setFormSubmitted(false);
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  };

  const handleEmpresas = (values) => {
    const newData = values.map((obj) => obj.value);
    console.log("newData", newData);
    if (newData.length === 0) {
      formState.empresas = "";
    } else {
      formState.empresas = newData;
    }
    console.log("formState", formState);
  };
  return (
    <form onSubmit={(event) => handleForm(event, action)}>
      <div className="flex flex-col md:flex-row gap-3 mb-2">
        <div className="w-full md:w-2/4">
          <label htmlFor="nombre" className="font-semibold">
            Nombre de capacitación
          </label>
          <input type="hidden" defaultValue={"fds"} />
          <input
            type="text"
            name="nombre"
            id="nombre"
            className="input input-bordered input-sm w-full"
            value={nombre}
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
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[]}
            isMulti
            options={empresasDb}
            onChange={(selectedOption) => handleEmpresas(selectedOption)}
            name="empresas"
            placeholder="Selecciona empresa"
          />
          {!!empresasValid && formSubmitted && (
            <p className="text-sm text-red-700">{empresasValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-2">
        <div className="w-full md:w-1/3">
          <label htmlFor="instructor" className="font-semibold">
            Nombre del instructor
          </label>
          <input
            type="text"
            name="instructor"
            id="instructor"
            className="input input-bordered input-sm w-full"
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
            type="text"
            name="urlVideo"
            id="urlVideo"
            className="input input-bordered input-sm w-full"
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
            className="file-input file-input-bordered file-input-sm w-full"
            accept=".png, .jpg, .jpeg"
            onChange={onInputChange}
          />
          {!!certificadoValid && formSubmitted && (
            <p className="text-sm text-red-700">{certificadoValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-2">
        <div className="w-full md:w-1/4">
          <label htmlFor="horas" className="font-semibold">
            Horas
          </label>
          <input
            type="number"
            name="horas"
            id="horas"
            className="input input-bordered input-sm w-full"
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
            className="input input-bordered input-sm w-full"
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
            className="input input-bordered input-sm w-full"
            value={fechaCulminacion}
            onChange={onInputChange}
          />
          {!!fechaCulminacionValid && formSubmitted && (
            <p className="text-sm text-red-700">{fechaCulminacionValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="fechaAplazo" className="font-semibold">
            Fecha de aplazo
          </label>
          <input
            type="date"
            name="fechaAplazo"
            id="fechaAplazo"
            className="input input-bordered input-sm w-full"
            value={fechaAplazo}
            onChange={onInputChange}
          />
          {!!fechaAplazoValid && formSubmitted && (
            <p className="text-sm text-red-700">{fechaAplazoValid}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <Button description={action === "ADD" ? "Agregar" : "Guardar"} />
      </div>
    </form>
  );
};

export default FormularioInicio;
