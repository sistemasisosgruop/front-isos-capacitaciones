import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import { useForm } from "../../../hooks/useForms";
import validate from "../trabajador/components/validateExcel";
import { hideLoader, showLoader } from "../../../utils/loader";
import { initialFormImport } from "../trabajador/config";
import { postImportarExcel } from "../../../services/emo";
import { initialForm } from "./config";

const FormularioImportar = ({ empresas, closeModal, setRefetchData,actualizar }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formValidations = validate();
  const {
    excel,
    excelValid,

    formState,
    isFormValid,
    onInputChange,
  } = useForm(initialFormImport, formValidations);

  const handleForm = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    const data = new FormData();
    data.append("file", excel);

    // console.log(data);

    showLoader();
    postImportarExcel(data).then(({ data, message = null }) => {
      if (data) {
        toast.success(message || "Agregado con exito", {
          position: "bottom-right",
        });
        setRefetchData((data) => !data);
        closeModal();
      } else {
        toast.error(message, { position: "bottom-right" });
      }
      hideLoader();
    });
  };
  return (
    <form onSubmit={handleForm}>
      <input
        type="file"
        name="excel"
        accept=".xlsx,.xls"
        onChange={onInputChange}
        className="w-full mb-1 file-input file-input-bordered file-input-sm"
      />
      {!!excelValid && formSubmitted && (
        <p className="text-sm text-red-700">{excelValid}</p>
      )}

      <div className="mt-4 text-end">
        <Button description="Enviar" />
      </div>
    </form>
  );
};

export default FormularioImportar;
