import React, { useReducer } from "react";
import { types } from "../types/types";
import { AuthContext } from "./AuthContext";
import authReducer from "./authReducer";

const getUserLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("userIsos"));
  const userFormat = user
    ? { logged: true, user: user }
    : { logged: false, user: {} };

  return userFormat;
};

const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(
    authReducer,
    {},
    getUserLocalStorage
  );

  const login = (user = {}) => {
    let idUser = user.idUsuario
    let rol = user.rol

    const action = {
      type: types.login,
      payload: user,
    };
    // console.log("Este es user:" + user);
    localStorage.setItem("userIsos", JSON.stringify(user));
    localStorage.setItem("userId", idUser);
    localStorage.setItem("rol", rol);
    dispatch(action);
  };

  const logout = (user = {}) => {
    const action = {
      type: types.logout,
      payload: {},
    };
    localStorage.removeItem("userIsos");
    localStorage.removeItem("userId");
    localStorage.removeItem("rol");

    dispatch(action);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
