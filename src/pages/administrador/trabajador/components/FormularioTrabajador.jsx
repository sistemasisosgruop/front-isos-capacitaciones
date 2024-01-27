import { useState } from "react";
import Button from "../../../../components/Button";
import { formatDateYMD } from "../../../../utils/formtDate";
import { hideLoader, showLoader } from "../../../../utils/loader";
import validate from "../validateFormModal";
import { useForm } from "../../../../hooks/useForms";
import { toast } from "react-toastify";
import {
  getTrabajador,
  patchTrabajador,
  postTrabajador,
} from "../../../../services/trabajador";

const FormularioTrabajador = ({
  initialForm,
  addItem,
  updateRow,
  closeModal,
  empresas,
  updateData,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formValidations = validate();
  //tipo de accion del formulario
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
    celular,
    user,
    rol,

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
    celularValid,
    formState,
    isFormValid,
    onInputChange,
    onResetForm,
  } = useForm(initialForm, formValidations);

  const handleForm = async (event, action) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) return;

    //establecemos formato solicitado BACK
    const { password, empresa, ...newFormat } = formState;
    const jsonData = newFormat;
    const newFormDate = formatDateYMD(newFormat.fechadenac);

    jsonData.empresaId = empresa;
    // jsonData.fechadenac = newFormDate;

    if (action === "ADD") {
      //reset
      jsonData.user = {
        username: formState.dni,
        contraseña: password,
        rol: formState.rol,
      };
      jsonData.user = {
        username: formState.dni,
        contraseña: formState.dni,
        rol: formState.rol === "Supervisor" ? "Supervisor" : "Trabajador",
      };
      add(jsonData);
    } else {
      if (password !== "") {
        jsonData.user = {
          username: formState.dni,
          contraseña: password,
          rol: formState.rol === "Supervisor" ? "Supervisor" : "Trabajador",
        };
      }
      update(jsonData);
    }
  };

  console.log(rol);

  const update = (dataForm) => {
    showLoader();
    delete dataForm.emoPdf;
    patchTrabajador(dataForm).then(({ data, message = null }) => {
      if (data) {
        const { createdAt, ...newRowData } = data;

        getTrabajador(dataForm.id).then(({ data }) => {
          data["nombreEmpresa"] = data.empresa.nombreEmpresa;
          updateRow(data);
        });
        toast.success("Actualizado con exito", {
          position: "bottom-right",
        });
        newRowData["nombreEmpresa"] = newRowData.empresa.nombreEmpresa;
        closeModal();
        setFormSubmitted(false);
        updateData();
      } else {
        toast.error(message, {
          position: "bottom-right",
        });
      }
      hideLoader();
    });
  };

  const add = (dataForm) => {
    showLoader();
    const { id, ...newData } = dataForm;
    delete dataForm.emoPdf;
    postTrabajador(newData).then(({ data, message = null }) => {
      if (data) {
        const { createdAt, ...newrowData } = data;
        getTrabajador(data.id).then(({ data }) => {
          data["nombreEmpresa"] = data.empresa.nombreEmpresa;
          addItem(0, data);
        });
        toast.success("Agregado con exito", {
          position: "bottom-right",
        });
        closeModal();
        setFormSubmitted(false);
        onResetForm();
        updateData();
      } else {
        toast.error(message, {
          position: "bottom-right",
        });
      }
      hideLoader();
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
          <select
            className="select select-bordered select-sm block w-full"
            id="genero"
            name="genero"
            onChange={onInputChange}
            value={genero}
          >
            <option value="" disabled>
              {" "}
              Seleccione una genero{" "}
            </option>
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
          </select>
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
          <label htmlFor="edad" className="font-semibold">
            Celular
          </label>
          <input
            type="number"
            name="celular"
            id="celular"
            className="input input-bordered input-sm w-full"
            value={celular}
            onChange={onInputChange}
          />
          {!!celularValid && formSubmitted && (
            <p className="text-sm text-red-700">{celularValid}</p>
          )}
        </div>
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
            className="input input-bordered file-input-sm w-full"
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
        {action === "UPDATE" ? (
          <div className="w-full md:w-1/3">
            <label htmlFor="password" className="font-semibold">
              Contraseña{" "}
              <span className="text-yellow-500 text-sm">
                (dejar vacio para no actualizar este campo )
              </span>
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
          </div>
        ) : (
          ""
        )}

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
        <div className="w-full md:w-1/3">
          <label htmlFor="rol" className="font-semibold">
            Supervisor
          </label>
          <select
            className="select select-bordered select-sm block w-full"
            id="rol"
            name="rol"
            onChange={onInputChange}
            value={rol}
          >
            <option value="Trabajador" selected>
              {" "}
              Seleccione una opción{" "}
            </option>
            <option value="Supervisor">Si</option>
            <option value="Trabajador">No</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button description={action === "ADD" ? "Agregar" : "Guardar"} />
      </div>
    </form>
  );
};

export default FormularioTrabajador;
