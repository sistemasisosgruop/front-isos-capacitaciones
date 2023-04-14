import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import Button from "../../components/Button";

import { AuthContext } from "../../context/auth/authContext";
import { useForm } from "../../hooks/useForms";
import validate from "./validateForm";
import baseApiAuth from "../../services/auth";

let initialForm = {
  user: "",
  password: "",
};

const FormLogin = () => {
  const { login, authState } = useContext(AuthContext);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorLogin, setErrorLogin] = useState({});

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

  const getToken = async (payload) => {
    const response = await baseApiAuth()
      .post("/login", payload)
      .catch((error) => {
        if (error.response)
          return { status: error.response.status, data: null };
      });
    return response;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) return;
    const { user: username, password: contraseña } = formState;
    const peticionAuth = await getToken({ username, contraseña });

    if (peticionAuth.status === 200) {
      const { nombres, apellidoPaterno, dni } = peticionAuth.data.user;
      const { token } = peticionAuth.data;
      console.log(' peticionAuth.data.user',  peticionAuth.data)
      login({ nombres, apellidoPaterno, dni, token });
      navigate("/menu/admin/opciones", {
        replace: true,
      });
    } else {
      if (peticionAuth.status === 401) {
        setErrorLogin({
          state: true,
          message: "La contraseña o usuario son incorrectos",
        });
      } else {
        setErrorLogin({
          state: true,
          message: `Ocurrio un error en el servidor => ${peticionAuth.status}`,
        });
      }
      setTimeout(() => {
        setErrorLogin({});
      }, 2000);
    }
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
      {errorLogin.state && <Alert message={errorLogin.message} />}
    </form>
  );
};

export default FormLogin;
