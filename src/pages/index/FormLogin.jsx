import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import Button from "../../components/Button";

import { AuthContext } from "../../context/auth/authContext";
import { useForm } from "../../hooks/useForms";
import validate from "./validateForm";
import { postAuth } from "../../services/auth";
import { toast } from "react-toastify";
let initialForm = {
  user: "",
  password: "",
};

const FormLogin = () => {
  const { login } = useContext(AuthContext);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();
  const formValidations = validate();

  const {
    formState,
    user,
    password,
    onInputChange,
    isFormValid,
    userValid,
    passwordValid,
  } = useForm(initialForm, formValidations);

  const handleLogin = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) return;

    const { user: username, password: contraseña } = formState;

    postAuth({ username, contraseña }).then(
      ({ data, message = null, status }) => {
        if (status === 200) {
          const rol = data.user.rol;
          const token = data.token;
          let idUsuario = null;
          let rutaInicio = "";

          if (rol === "Administrador") {
            const nombres = data.admin.nombres;
            const apellidoPaterno = "";
            rutaInicio = "/menu/admin/opciones";
            idUsuario = data.admin.id;
            login({ nombres, apellidoPaterno, token, idUsuario, rol });
          } else {
            const nombres = data.worker.nombres;
            const apellidoPaterno = data.worker.apellidoPaterno;
            idUsuario = data.worker.id;
            rutaInicio = "/menu/trabajador/opciones";
            login({ nombres, apellidoPaterno, token, idUsuario, rol });
          }
          setTimeout(() => {
            navigate(rutaInicio, {
              replace: true,
            });
          }, 500);
        } else {
          if (status === 401) {
            toast.error(
              "el usuario ingresado no cuenta con credenciales correctas",
              {
                position: "bottom-right",
              }
            );
          } else {
            toast.error(`Ocurrio un error en el servidor`, {
              position: "bottom-right",
            });
          }
        }
      }
    );
  };

  return (
    <form onSubmit={handleLogin}>
      <label>Usuario - 72895382</label>
      <input
        type="text"
        value={user}
        name="user"
        className="input input-bordered input-sm w-full"
        onChange={onInputChange}
      />
      {!!userValid && formSubmitted && <p>{userValid}</p>}

      <label>Contraseña</label>
      <input
        type="password"
        name="password"
        value={password}
        className="input input-bordered input-sm w-full mb-3"
        onChange={onInputChange}
      />
      {!!passwordValid && formSubmitted && <p>{passwordValid}</p>}

      <div className="text-center">
        <Button description="Iniciar sesion" />
      </div>
    </form>
  );
};

export default FormLogin;
