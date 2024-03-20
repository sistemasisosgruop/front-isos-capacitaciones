import { useState } from "react";
import Button from "../../../../components/Button";
import { useForm } from "../../../../hooks/useForms";
import validate from "../../trabajador/components/validateExcel";
import { postImportar } from "../../../../services/trabajador";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../../../../utils/loader";
import { initialFormImport } from "../../trabajador/config";
import ExcelJS from "exceljs";

const FormularioImportar = ({
  empresas,
  closeModal,
  setRefetchData,
  setRowData2,
}) => {
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

  const onChange = async (event) => {
    const file = event.target.files[0];
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1); // Si quieres la primera hoja de trabajo

    // Obtenemos los encabezados de la fila 4
    const headerRow = worksheet.getRow(4);
    const headers = [];
    headerRow.eachCell({ includeEmpty: true }, function (cell, colNumber) {
      headers[colNumber - 1] = cell.value;
    });
    const keyMapping = {
      "APELLIDO PATERNO": "apellidoPaterno",
      "APELLIDO  MATERNO": "apellidoMaterno",
      NOMBRES: "nombres",
      DNI: "dni",
      CONTRASEÑA: "contrasena",
      CELULAR: "celular",
      Nº: "id",
      "NO CUENTA CON EMO (COLOCAR NO)": "emo",
      "Indicar Trabajo Administrativo u Operario": "cargo",
      "SEXO (F/M)": "sexo",
      EDAD: "edad",
      "Tipo de trabajo": "tipo",
      "FECHA DE EXAMEN MEDICO": "fechaExamen",
      "FECHA DE NACIMIENTO": "fechaNacimiento",
      "CLINICA DONDE PASO SU EXAMEN": "clinica",
      "CARGO": "cargo",
    };
    const jsonData = [];
    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      if (rowNumber <= 4) return;

      let isEmptyRow = true;
      const rowObject = {};
      row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
        const originalKey = headers[colNumber - 1]?.trim(); // Asegúrate de quitar espacios en blanco alrededor de la clave
        const newKey = keyMapping[originalKey];

        rowObject[newKey || originalKey] = cell.value;
        if (
          cell.value !== null &&
          cell.value !== undefined &&
          cell.value !== ""
        ) {
          isEmptyRow = false;
        }
      });

      if (!isEmptyRow) {
        jsonData.push(rowObject);
      }
    });
    console.log(jsonData);
    if (jsonData.length > 0) {
      setRowData2(jsonData);
      closeModal();
    }
  };

  return (
    <form>
      <input
        type="file"
        name="excel"
        accept=".xlsx,.xls"
        onChange={onChange}
        className="file-input file-input-bordered file-input-sm w-full mb-1"
      />
      {!!excelValid && formSubmitted && (
        <p className="text-sm text-red-700">{excelValid}</p>
      )}

      <div className="text-end">
        <Button description="Enviar" />
      </div>
    </form>
  );
};

export default FormularioImportar;
