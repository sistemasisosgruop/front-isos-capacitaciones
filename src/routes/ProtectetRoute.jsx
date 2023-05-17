import { Navigate } from "react-router";
import { useLoaderData } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth/authContext.jsx";
import { validToken } from "../services/auth.js";

const ProtectedRoute =  ({ expectedRoles, children }) => {
  const { authState } = useContext(AuthContext);
  const statusToken = useLoaderData();
  const isAuthorized = (statusToken === 200) ? true : false;
  const areRolesRequired = !!expectedRoles?.length;
  const rolesUserLogged = [authState.user.rol]; // 'roles' -> roles que seran admitidos por la ruta protegida

  const rolesMatch = areRolesRequired
    ? expectedRoles.some((r) => rolesUserLogged.indexOf(r) >= 0)
    : true;

  if (!isAuthorized || !rolesMatch) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
