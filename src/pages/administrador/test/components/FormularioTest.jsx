import { useState } from "react";
import Button from "../../../../components/Button";

import validate from "../validateFormModal";
import { useForm } from "../../../../hooks/useForms";
import { patchEmpresas, postEmpresas } from "../../../../services/empresa";
import { toast } from "react-toastify";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { patchTest, postTest } from "../../../../services/test";
const animatedComponents = makeAnimated();

const FormularioTest = ({
  initialForm,
  addItem,
  updateRow,
  closeModal,
  empresasDb,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formValidations = validate();
  //tipo de accion (Event)
  const action = initialForm.Empresas === "" ? "ADD" : "UPDATE";
  const {
    id,
    detalle,
    urlTest,
    fechaCr,
    fechaVen,
    fechaAplazo,
    Empresas,

    detalleValid,
    urlTestValid,
    fechaCrValid,
    fechaVenValid,
    fechaAplazoValid,
    empresasValid,

    formState,
    isFormValid,
    onInputChange,
    setFormState,
    onResetForm,
  } = useForm(initialForm, formValidations);

  const handleForm = async (event, action) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) return;

    const { fechaAplazo, Empresas: sendEmpresas, ...formatData } = formState;
    const formatEmpresas = sendEmpresas.map((option) => option.value);
    formatData.empresas = formatEmpresas;
    if (action === "ADD") {
      add(formatData);
    } else {
      update(formatData);
    }
  };

  const update = ({ id, ...data }) => {
    patchTest(id, data).then(({ data }) => {
      if (data) {
        toast.success("Actualizado con exito", {
          position: "bottom-right",
        });
        closeModal();
        updateRow(data);
        setFormSubmitted(false);
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  };

  const add = ({ id, ...data }) => {
    postTest(data).then(({ data }) => {
      if (data) {
        toast.success("Agregado con exito", {
          position: "bottom-right",
        });
        closeModal();
        addItem(0, data);
        onResetForm();
        setFormSubmitted(false);
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  };

  const handleEmpresas = (values) => {
    formState.Empresas = values;
    setFormState((valueForm) => ({ ...valueForm, ...formState }));
  };

  return (
    <form onSubmit={(e) => handleForm(e, action)}>
      <div className="flex flex-col md:flex-row gap-3  mb-2">
        <div className="w-full md:w-1/2">
          <label htmlFor="detalle" className="font-semibold">
            Nombre de test
          </label>
          <input type="hidden" defaultValue={"fds"} />
          <input
            type="text"
            name="detalle"
            id="detalle"
            className="input input-bordered input-sm w-full"
            value={detalle}
            onChange={onInputChange}
          />
          {!!detalleValid && formSubmitted && (
            <p className="text-sm text-red-700">{detalleValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="empresas" className="font-semibold">
            Nombre de las empresas
          </label>
          <Select
            components={animatedComponents}
            value={Empresas}
            isMulti
            options={empresasDb}
            onChange={handleEmpresas}
            placeholder="Selecciona empresa"
          />
          {!!empresasValid && formSubmitted && (
            <p className="text-sm text-red-700">{empresasValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3  mb-2">
        <div className="w-full md:w-1/4">
          <label htmlFor="urlTest" className="font-semibold">
            URL video
          </label>
          <input
            type="url"
            name="urlTest"
            id="urlTest"
            className="input input-bordered input-sm w-full"
            value={urlTest}
            onChange={onInputChange}
          />
          {!!urlTestValid && formSubmitted && (
            <p className="text-sm text-red-700">{urlTestValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="fechaCr" className="font-semibold">
            Fecha inicio
          </label>
          <input
            type="date"
            name="fechaCr"
            id="fechaCr"
            className="input input-bordered input-sm w-full"
            value={fechaCr}
            onChange={onInputChange}
          />
          {!!fechaCrValid && formSubmitted && (
            <p className="text-sm text-red-700">{fechaCrValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="fechaVen" className="font-semibold">
            Fecha de culminación
          </label>
          <input
            type="date"
            name="fechaVen"
            id="fechaVen"
            className="input input-bordered input-sm w-full"
            value={fechaVen}
            onChange={onInputChange}
          />
          {!!fechaVenValid && formSubmitted && (
            <p className="text-sm text-red-700">{fechaVenValid}</p>
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
      <div className="flex justify-end">
        <Button description={action === "ADD" ? "Agregar" : "Guardar"} />
      </div>
    </form>
  );
};

export default FormularioTest;
