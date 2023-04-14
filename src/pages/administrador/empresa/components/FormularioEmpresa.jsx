import { useState } from "react";
import Button from "../../../../components/Button";

import validate from "../validateFormModal";
import { useForm } from "../../../../hooks/useForms";
import { patchEmpresas, postEmpresas } from "../../../../services/empresa";
import { toast } from "react-toastify";

const FormularioEmpresa = ({ initialForm, addItem, updateRow, closeModal }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formValidations = validate();
  //tipo de accion (Event)
  const action = initialForm.empresa === "" ? "ADD" : "UPDATE";

  const {
    id,
    empresa,
    ruc,
    nombreGerente,
    numeroContacto,
    direccion,
    logoEmpresa,
    fondoCertificado,
    empresaValid,
    rucValid,
    nombreGerenteValid,
    numeroContactoValid,
    direccionValid,
    logoEmpresaValid,
    fondoCertificadoValid,
    formState,
    isFormValid,
    onInputChange,
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

  return (
    <form onSubmit={(e) => handleForm(e, action)}>
      <div className="flex flex-col md:flex-row gap-3  mb-2">
        <div className="w-full md:w-3/4">
          <label htmlFor="empresa" className="font-semibold">
            Empresa
          </label>
          <input type="hidden" defaultValue={"fds"} />
          <input
            type="text"
            name="empresa"
            id="empresa"
            className="input input-bordered input-sm w-full"
            value={empresa}
            onChange={onInputChange}
          />
          {!!empresaValid && formSubmitted && (
            <p className="text-sm text-red-700">{empresaValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="ruc" className="font-semibold">
            RUC
          </label>
          <input
            type="number"
            name="ruc"
            id="ruc"
            className="input input-bordered input-sm w-full"
            value={ruc}
            onChange={onInputChange}
          />
          {!!rucValid && formSubmitted && (
            <p className="text-sm text-red-700">{rucValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3  mb-2">
        <div className="w-full md:w-3/4">
          <label htmlFor="gerente" className="font-semibold">
            Nombre del gerente
          </label>
          <input
            type="text"
            name="nombreGerente"
            id="gerente"
            className="input input-bordered input-sm w-full"
            value={nombreGerente}
            onChange={onInputChange}
          />
          {!!nombreGerenteValid && formSubmitted && (
            <p className="text-sm text-red-700">{nombreGerenteValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="contacto" className="font-semibold">
            Número de contacto
          </label>
          <input
            type="number"
            name="numeroContacto"
            id="contacto"
            className="input input-bordered input-sm w-full"
            value={numeroContacto}
            onChange={onInputChange}
          />
          {!!numeroContactoValid && formSubmitted && (
            <p className="text-sm text-red-700">{numeroContactoValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3  mb-2">
        <div className="w-full md:w-2/4">
          <label htmlFor="direccion" className="font-semibold">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            className="input input-bordered input-sm w-full"
            value={direccion}
            onChange={onInputChange}
          />
          {!!direccionValid && formSubmitted && (
            <p className="text-sm text-red-700">{direccionValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="logoEmpresa" className="font-semibold">
            Logo de la empresa
          </label>
          <input
            type="file"
            id="logoEmpresa"
            name="logoEmpresa"
            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
            onChange={onInputChange}
            accept=".png, .jpg, .jpeg"
          />
          {!!logoEmpresaValid && formSubmitted && (
            <p className="text-sm text-red-700">{logoEmpresaValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="fondo" className="font-semibold">
            Fondo del certificado
          </label>
          <input
            type="file"
            id="fondo"
            name="fondoCertificado"
            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
            onChange={onInputChange}
            accept=".png, .jpg, .jpeg"
          />
          {!!fondoCertificadoValid && formSubmitted && (
            <p className="text-sm text-red-700">{fondoCertificadoValid}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button description={action === "ADD" ? "Agregar" : "Guardar"} />
      </div>
    </form>
  );
};

export default FormularioEmpresa;
