import { useEffect, useState } from "react";
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
  const [rol, setRol] = useState("")
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
    email,
    user,

    nombresValid,
    apellidoPaternoValid,
    apellidoMaternoValid,
    dniValid,
    emailValid,
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

  console.log(initialForm);

  const handleForm = async (event, action) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) return;

    //establecemos formato solicitado BACK
    const { password, empresa, ...newFormat } = formState;
    const jsonData = newFormat;
    delete jsonData.rol
    const newFormDate = formatDateYMD(newFormat.fechadenac);

    jsonData.empresaId = empresa;
    // jsonData.fechadenac = newFormDate;

    if (action === "ADD") {

      // switch (rol) {
      //   case "Supervisor":
      //     rol = "Supervisor"
      //     break;
      
      //   default:
      //     break;
      // }
      
      //reset
      jsonData.user = {
        username: formState.dni,
        contraseña: password,
        rol: rol,
      };
      jsonData.user = {
        username: formState.dni,
        contraseña: formState.dni,
        rol: rol,
      };
      add(jsonData);
    } else {
      if (password !== "") {
        jsonData.user = {
          username: formState.dni,
          contraseña: password,
          rol: rol,
        };
      }
      update(jsonData);
    }
  };
  useEffect(() => {
    setRol(initialForm.rol || "");
  }, [initialForm.rol]);

  const update = (dataForm) => {
    showLoader();
    delete dataForm.emoPdf;
      dataForm.user = {};
  
    // Mueve la propiedad 'rol' dentro del objeto 'user'
    dataForm.user.rol = rol;
    patchTrabajador(dataForm).then(({ data, message = null }) => {
      if (data) {
        const { createdAt, ...newRowData } = data;

        getTrabajador(dataForm.id).then(({ data }) => {
          data["nombreEmpresa"] = data.empresa.nombreEmpresa;
          updateRow(data);
        });
        setRol(initialForm.rol || "")
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
    delete dataForm.rol
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
        setRol(initialForm.rol || "")
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
      <div className="flex flex-col gap-3 mb-2 md:flex-row">
        <div className="w-full md:w-1/3">
          <label htmlFor="nombres" className="font-semibold">
            Nombres
          </label>
          <input type="hidden" defaultValue={"fds"} />
          <input
            type="text"
            name="nombres"
            id="nombres"
            className="w-full input input-bordered input-sm"
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
            className="w-full input input-bordered input-sm"
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
            className="w-full input input-bordered input-sm"
            value={apellidoMaterno}
            onChange={onInputChange}
          />
          {!!apellidoMaternoValid && formSubmitted && (
            <p className="text-sm text-red-700">{apellidoMaternoValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 mb-2 md:flex-row">
        <div className="w-full md:w-1/3">
          <label htmlFor="dni" className="font-semibold">
            DNI
          </label>
          <input
            type="number"
            name="dni"
            id="dni"
            className="w-full input input-bordered input-sm"
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
            className="block w-full select select-bordered select-sm"
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
            className="w-full input input-bordered input-sm"
            value={edad}
            onChange={onInputChange}
          />
          {!!edadValid && formSubmitted && (
            <p className="text-sm text-red-700">{edadValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 mb-2 md:flex-row">
        <div className="w-full md:w-1/3">
          <label htmlFor="edad" className="font-semibold">
            Celular
          </label>
          <input
            type="number"
            name="celular"
            id="celular"
            className="w-full input input-bordered input-sm"
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
            className="w-full input input-bordered input-sm"
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
            className="w-full input input-bordered file-input-sm"
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
            className="w-full input input-bordered input-sm"
            value={fechadenac}
            onChange={onInputChange}
          />
          {!!fechadenacValid && formSubmitted && (
            <p className="text-sm text-red-700">{fechadenacValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 mb-2 md:flex-row">
        {action === "UPDATE" ? (
          <div className="w-full md:w-1/3">
            <label htmlFor="password" className="font-semibold">
              Contraseña{" "}
              <span className="text-sm text-yellow-500">
                (dejar vacio para no actualizar este campo )
              </span>
            </label>
            <input
              type="text"
              id="password"
              name="password"
              className="w-full max-w-xs file-input file-input-bordered file-input-sm"
              value={password}
              onChange={onInputChange}
              accept=".png, .jpg, .jpeg"
            />
          </div>
        ) : (
          ""
        )}

        <div className="w-full md:w-1/3">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="w-full input input-bordered input-sm"
            value={email}
            onChange={onInputChange}
          />
          {!!emailValid && formSubmitted && (
            <p className="text-sm text-red-700">{emailValid}</p>
          )}
        </div>

        <div className="w-full md:w-1/3">
          <label htmlFor="empresa" className="font-semibold">
            Empresa
          </label>

          <select
            className="block w-full select select-bordered select-sm"
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
            Rol
          </label>
          <select
            className="block w-full select select-bordered select-sm"
            id="rol"
            name="rol"
            onChange={(e)=> setRol(e.target.value)}
            value={rol}
          >
            <option value="" selected>
              Seleccione una opción
            </option>
            <option value="Supervisor">Supervisor</option>
            <option value="Capacitador">Capacitador</option>
            <option value="Trabajador">Trabajador</option>
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
