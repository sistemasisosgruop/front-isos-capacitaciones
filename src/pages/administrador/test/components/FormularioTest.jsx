import { useState } from "react";
import Button from "../../../../components/Button";

import validate from "../validateFormModal";
import { useForm } from "../../../../hooks/useForms";
import { patchEmpresas, postEmpresas } from "../../../../services/empresa";
import { toast } from "react-toastify";

import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const FormularioTest = ({ initialForm, addItem, updateRow, closeModal,empresasDb }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formValidations = validate();
  //tipo de accion (Event)
  const action = initialForm.empresas === "" ? "ADD" : "UPDATE";
console.log('empresasDb', empresasDb)
  const {
    id,
    detalle,
    urlTest,
    fechaCr,
    fechaVen,
    fechaAplazo,
    empresas,

    detalleValid,
    urlTestValid,
    fechaCrValid,
    fechaVenValid,
    fechaAplazoValid,
    empresasValid,

    formState,
    isFormValid,
    onInputChange,
    setFormState
  } = useForm(initialForm, formValidations);

  const handleForm = async (event, action) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) return;
    console.log('formState', formState)
    const data = new FormData();
    data.append("nombreEmpresa",empresa)
    data.append("direccion",direccion)
    data.append("nombreGerente",nombreGerente)
    data.append("numeroContacto",numeroContacto)
    data.append("imagenLogo",logoEmpresa)
    data.append("imagenCertificado",fondoCertificado)
    data.append("RUC",ruc)
    
    if (action === "ADD") {
      add(data);
    } else {
      update(data);
    }
  };

  const update = (data) => {
    data.append("id", id)
    patchEmpresas(data).then((res) => {
      const { data } = res;
      if (data) {
        const { createdAt, ...newRowData } = res.data;
        toast.success("Actualizado con exito", {
          position: "bottom-right",
        });
        closeModal();
        updateRow(newRowData);
        setFormSubmitted(false);
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  };

  const add = (data) => {
    postEmpresas(data).then((res) => {
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

   const dataSelect = [
    { value: '1', label: 'uno', },
    { value: '2', label: 'dos',},
    { value: '3', label: 'tres'},
    { value: '4', label: 'cuatro',},
    { value: '5', label: 'cinco'},
  ];

  const handleEmpresas = (values) => {
    const newData = values.map((obj) => obj.value);
    if (newData.length === 0) {
      setFormState( formState => ({ ...formState, ['empresas']: '' }))
    } else {
      console.log('newData', newData)
      setFormState( formState => ({ ...formState, ['empresas']: newData }))
    }
    console.log("formState", formState);
  };
  console.log('formState', formState)
console.log('empresas', empresas)
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
            closeMenuOnSelect={false}
            components={animatedComponents}
           // value={empresas}
            isMulti
            options={dataSelect}
            onChange={(selectedOption) => handleEmpresas(selectedOption)}
            name="empresas"
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
            type="text"
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
