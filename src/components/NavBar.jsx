import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth/authContext";

const NavBar = () => {

  const { logout, authState } = useContext( AuthContext )
  const nombres = `${authState.user.nombres} ${authState.user.apellidoPaterno}`;
  const navigate = useNavigate();

  const handleLogout = () => {
    // cerrar sesion  DB

    logout();
    navigate('/',{
      replace:true
    })  

  }
  return (
    <div className="flex justify-end w-full bg-emerald-600 px-3">
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://png.pngtree.com/png-vector/20220623/ourmid/pngtree-user-avatar-icon-profile-silhouette-png-image_5173766.png" />
            </div>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">{ nombres }</a>
            </li>
            <li>
              <a>Configuración</a>
            </li>
            <li>
              <a onClick={ handleLogout }>Cerrar sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
