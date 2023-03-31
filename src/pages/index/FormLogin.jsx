import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import Button from "../../components/Button";

import { AuthContext } from "../../context/auth/authContext";
import useForm from "../../hooks/useForms";
import { authAPi } from "../../services/auth";
import validate from "./validateForm";

let initialForm={
  user:"",
  password:"",
}

const FormLogin = () => {
  const { login, authState } = useContext(AuthContext);
  const [errorLogin, setErrorLogin] = useState({ state: false, message: null });
  const navigate = useNavigate();

  const {
    form,
    errors,
    HandleForm,
    HandleBlur,
    getDataForm,
  } = useForm(initialForm, validate);

  //const payload = { dni: "72895382", contraseña: "72895382" };

  const getToken = async (payload) => {
    const response = await authAPi.post("/login", payload).catch((error) => {
      if (error.response) {
        return { status: error.response.status, data: null };
      }
    });
    return response;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const dataForm = getDataForm();

    const peticionAuth = await getToken( dataForm );
    if (peticionAuth.status === 200) {
      const { nombres, apellidoPaterno, dni } = peticionAuth.data.user;
      const { token } = peticionAuth.data;
      login( { nombres, apellidoPaterno, dni, token } );
      navigate("/menu", {
        replace: true,
      });
    }
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
  };

  return (
    <form onSubmit={handleLogin}>
      <label>Usuario</label>
      <input
        type="text"
        value={form.user}
        name="user"
        className="input input-bordered input-sm w-full"
        onBlur={HandleBlur}
        onChange={HandleForm}
      />
      {errors.name && <p>{errors.name}</p>}

      <label>Contraseña</label>
      <input
        type="password"
        name="password"
        value={form.password}
        className="input input-bordered input-sm w-full mb-3"
        onBlur={HandleBlur}
        onChange={HandleForm}
      />
      {errors.name && <p>{errors.name}</p>}

      <div className="text-center">
        <Button description="Iniciar sesion" />
      </div>
      {errorLogin.state && <Alert message={errorLogin.message} />}
    </form>
  );
};

export default FormLogin;
