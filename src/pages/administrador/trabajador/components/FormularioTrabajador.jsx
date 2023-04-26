import { useEffect, useState } from "react";
import Button from "../../../../components/Button";

import { useForm } from "../../../../hooks/useForms";
import {
  getEmpresas,
  patchEmpresas,
  postEmpresas,
} from "../../../../services/empresa";
import { toast } from "react-toastify";
import validate from "../validateFormModal";
import {
  patchTrabajador,
  postTrabajador,
} from "../../../../services/trabajador";
import formatDateYMD from "../../../../utils/formtDate";

const FormularioTrabajador = ({
  initialForm,
  addItem,
  updateRow,
  closeModal,
  empresas,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formValidations = validate();
  //tipo de accion (Event)
  const action = initialForm.dni === "" ? "ADD" : "UPDATE";

  const {
    id,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    dni,
    genero,
    edad,
    areadetrabajo,
    cargo,
    fechadenac,
    password,
    empresa,

    nombresValid,
    apellidoPaternoValid,
    apellidoMaternoValid,
    dniValid,
    generoValid,
    edadValid,
    areadetrabajoValid,
    cargoValid,
    fechadenacValid,
    passwordValid,
    empresaValid,

    formState,
    isFormValid,
    onInputChange,
  } = useForm(initialForm, formValidations);

  const handleForm = async (event, action) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) return;

    //establecemos formato solicitado BACK
    const { password, empresa, ...newFormat } = formState;
    const jsonData = newFormat;
    const newFormDate = formatDateYMD(new Date(newFormat.fechadenac));

    jsonData.empresaId = empresa;
    jsonData.fechadenac = newFormDate;
    jsonData.user = { username: formState.dni, contraseña: password };

    if (action === "ADD") {
      add(jsonData);
    } else {
      update(jsonData);
    }
  };

  const update = (data) => {
    console.log('data', data)
    patchTrabajador(data).then((res) => {
      console.log("res", res);
      if (res.data) {
        const { createdAt, ...newRowData } = res?.data;
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
    const { id, ...newData } = data;
    console.log("newData", newData);
    postTrabajador(newData).then((res) => {
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
        console.log('res', res)
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  };
  return (
    <form onSubmit={(e) => handleForm(e, action)}>
      <div className="flex flex-col md:flex-row gap-3 mb-2">
        <div className="w-full md:w-1/3">
          <label htmlFor="nombres" className="font-semibold">
            Nombres
          </label>
          <input type="hidden" defaultValue={"fds"} />
          <input
            type="text"
            name="nombres"
            id="nombres"
            className="input input-bordered input-sm w-full"
            value={nombres}
            onChange={onInputChange}
          />
          {!!nombresValid && formSubmitted && (
            <p className="text-sm text-red-700">{nombresValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="apellidoPaterno" className="font-semibold">
            Apellido paterno
          </label>
          <input
            type="text"
            name="apellidoPaterno"
            id="apellidoPaterno"
            className="input input-bordered input-sm w-full"
            value={apellidoPaterno}
            onChange={onInputChange}
          />
          {!!apellidoPaternoValid && formSubmitted && (
            <p className="text-sm text-red-700">{apellidoPaternoValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="apellidoPaterno" className="font-semibold">
            Apellido materno
          </label>
          <input
            type="text"
            name="apellidoMaterno"
            id="apellidoMaterno"
            className="input input-bordered input-sm w-full"
            value={apellidoMaterno}
            onChange={onInputChange}
          />
          {!!apellidoMaternoValid && formSubmitted && (
            <p className="text-sm text-red-700">{apellidoMaternoValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-2">
        <div className="w-full md:w-1/3">
          <label htmlFor="dni" className="font-semibold">
            DNI
          </label>
          <input
            type="number"
            name="dni"
            id="dni"
            className="input input-bordered input-sm w-full"
            value={dni}
            onChange={onInputChange}
          />
          {!!dniValid && formSubmitted && (
            <p className="text-sm text-red-700">{dniValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="genero" className="font-semibold">
            Genero
          </label>
          <input
            type="text"
            name="genero"
            id="genero"
            className="input input-bordered input-sm w-full"
            value={genero}
            onChange={onInputChange}
          />
          {!!generoValid && formSubmitted && (
            <p className="text-sm text-red-700">{generoValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="edad" className="font-semibold">
            Edad
          </label>
          <input
            type="number"
            name="edad"
            id="edad"
            className="input input-bordered input-sm w-full"
            value={edad}
            onChange={onInputChange}
          />
          {!!edadValid && formSubmitted && (
            <p className="text-sm text-red-700">{edadValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row  gap-3 mb-2">
        <div className="w-full md:w-1/3">
          <label htmlFor="areadetrabajo" className="font-semibold">
            Área de trabajo
          </label>
          <input
            type="text"
            id="areadetrabajo"
            name="areadetrabajo"
            className="input input-bordered input-sm w-full"
            value={areadetrabajo}
            onChange={onInputChange}
          />
          {!!areadetrabajoValid && formSubmitted && (
            <p className="text-sm text-red-700">{areadetrabajoValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="cargo" className="font-semibold">
            cargo
          </label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
            value={cargo}
            onChange={onInputChange}
            accept=".png, .jpg, .jpeg"
          />
          {!!cargoValid && formSubmitted && (
            <p className="text-sm text-red-700">{cargoValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="fechadenac" className="font-semibold">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            id="fechadenac"
            name="fechadenac"
            className="input input-bordered input-sm w-full"
            value={fechadenac}
            onChange={onInputChange}
          />
          {!!fechadenacValid && formSubmitted && (
            <p className="text-sm text-red-700">{fechadenacValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3  mb-2">
        <div className="w-full md:w-1/3">
          <label htmlFor="password" className="font-semibold">
            Contraseña
          </label>
          <input
            type="text"
            id="password"
            name="password"
            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
            value={password}
            onChange={onInputChange}
            accept=".png, .jpg, .jpeg"
          />
          {!!passwordValid && formSubmitted && (
            <p className="text-sm text-red-700">{passwordValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="empresa" className="font-semibold">
            Empresa
          </label>

          <select
            className="select select-bordered select-sm block w-full"
            id="empresa"
            name="empresa"
            onChange={onInputChange}
            value={empresa}
          >
            <option value="" disabled>
              Seleccione una empresa
            </option>
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
        </div>
      </div>
      <div className="flex justify-end">
        <Button description={action === "ADD" ? "Agregar" : "Guardar"} />
      </div>
    </form>
  );
};

export default FormularioTrabajador;
