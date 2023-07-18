import { useRef, useState } from "react";
import Button from "../../../../components/Button";
import { postEmo } from "../../../../services/emo";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../../../../utils/loader";
import validate from "./validateExcel";
import { useForm } from "../../../../hooks/useForms";
import { initialFormEmo } from "../config";

const FormularioEmo = ({
  initialForm,
  closeModal,
  setRefetchData,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const formValidations = validate();
  const {
    pdf,

    onInputChange,
  } = useForm(initialFormEmo, formValidations);
  const handleForm = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    const data = new FormData();
    data.append("file", pdf);

    const response = await postEmo(initialForm.id, data);

    if (response.status === 200) {
      toast.success(response.message || "Agregado con exito", {
        position: "bottom-right",
      });
      setRefetchData((data) => !data);
      // Limpiar el campo de entrada de archivos
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // O fileInputRef.current.value = '';
    }
      closeModal();
    } else {
      toast.error(response.message, { position: "bottom-right" });
    }
  };
  return (
    <form onSubmit={handleForm}>
      <input
        type="file"
        name="pdf"
        accept=".pdf"
        onChange={onInputChange}
        className="file-input file-input-bordered file-input-sm w-full mb-1"
        ref={fileInputRef}
      />
      {/* {!!excelValid && formSubmitted && (
      <p className="text-sm text-red-700">{excelValid}</p>
    )} */}
      <div className="text-end mt-2">
        <Button description="Enviar" />
      </div>
    </form>
  );
};

export default FormularioEmo;
