import { Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/auth/authContext.jsx";

const ProtectedRoute = ({ expectedRoles, children }) => {
  const { authState } = useContext(AuthContext);
  const isAuthorized = authState.logged;
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
