import React from "react";
import Button from "../../../../components/Button";
import { useForm } from "../../../../hooks/useForms";
import validate from "./validateExcel";
import { postImportar } from "../../../../services/trabajador";
import { useState } from "react";

const initialForm = {
  excel: "",
  empresa: "",
};

const FormularioImportar = ({ empresas }) => {

  const [formSubmitted, setFormSubmitted] = useState(false)
  const formValidations = validate();
  const {
    excel,
    empresa,
    empresaValid,
    excelValid,

    formState,
    isFormValid,
    onInputChange,
  } = useForm(initialForm, formValidations);

  const handleForm = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return

    const data = new FormData();
    data.append('file', excel);
      
    postImportar(empresa, data).then( res => {
      console.log('res', res)
    });
  };
  return (
    <form onSubmit={handleForm}>
      <input
        type="file"
        name="excel"
        onChange={onInputChange}
        className="file-input file-input-bordered file-input-sm w-full mb-3"
      />
      {!!excelValid && formSubmitted && (
        <p className="text-sm text-red-700">{excelValid}</p>
      )}
      <select
        className="select select-bordered select-sm w-full mb-3"
        name="empresa"
        onChange={onInputChange}
        value={empresa}
      >
        <option value={""}>Seleccione una empresa</option>
        {empresas.map((empresa) => {
          return (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nombreEmpresa}
            </option>
          );
        })}
      </select>
      {!!empresaValid && formSubmitted && (
        <p className="text-sm text-red-700">{empresaValid}</p>
      )}
      <div className="text-end">
        <Button description="Enviar" />
      </div>
    </form>
  );
};

export default FormularioImportar;
