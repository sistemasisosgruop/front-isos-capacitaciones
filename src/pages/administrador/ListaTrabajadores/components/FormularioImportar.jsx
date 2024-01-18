import { useState } from "react";
import Button from "../../../../components/Button";
import { useForm } from "../../../../hooks/useForms";
import validate from "../../trabajador/components/validateExcel";
import { postImportar } from "../../../../services/trabajador";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../../../../utils/loader";
import { initialFormImport } from "../../trabajador/config";
const FormularioImportar = ({ empresas, closeModal, setRefetchData }) => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const formValidations = validate();
    const {
      excel,
      empresa,
      empresaValid,
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
  
      console.log(data);
    //   showLoader();
    //   postImportar(empresa, data).then(({ data, message = null }) => {
    //     if (data) {
    //       toast.success(message || "Agregado con exito", {
    //         position: "bottom-right",
    //       });
    //       setRefetchData(data => !data);
    //       closeModal();
    //     } else {
    //       toast.error(message, { position: "bottom-right" });
    //     }
    //     hideLoader();
    //   });
    };
  return (
    <form onSubmit={handleForm}>
    <input
      type="file"
      name="excel"
      accept=".xlsx,.xls"
      onChange={onInputChange}
      className="file-input file-input-bordered file-input-sm w-full mb-1"
    />
    {!!excelValid && formSubmitted && (
      <p className="text-sm text-red-700">{excelValid}</p>
    )}

    {!!empresaValid && formSubmitted && (
      <p className="text-sm text-red-700">{empresaValid}</p>
    )}
    <div className="text-end">
      <Button description="Enviar" />
    </div>
  </form>
  )
}

export default FormularioImportar