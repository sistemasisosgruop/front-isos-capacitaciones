import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Index from "../pages/index/Index";
import Menu from "../pages/Menu";
import NotFound404 from "../pages/notFound404/NotFound404";
import "../styles/global.css";
import { userRoles } from "./constantsRoles";
import ProtectedRoute from "./protectetRoute";
import OpcionesTrabajador from "../pages/trabajador/opcionesTrabajador";
import OpcionesAdmin from "../pages/administrador/opciones/OpcionesAdmin";
import ListadoEmpresa from "../pages/administrador/empresa/ListadoEmpresa";
import ListadoTrabajador from "../pages/administrador/trabajador/ListadoTrabajador";
import ListaCapacitaciones from "../pages/administrador/capacitaciones/ListaCapacitaciones";
import OpcionesReportes from "../pages/administrador/reportes/OpcionesReportes";
import CapacitacionesTrabajador from "../pages/trabajador/capacitaciones/CapacitacionesTrabajador";

const router = createBrowserRouter([
  {
    path: "/menu",
    element: (
      <ProtectedRoute expectedRoles={[userRoles.ADMIN, userRoles.EMPLOYEE]}>
        <Menu />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "trabajador",
        element: (
          <ProtectedRoute expectedRoles={[userRoles.ADMIN]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "opciones", element: <OpcionesTrabajador/>},
          { path: "capacitaciones", element: <CapacitacionesTrabajador/> },
          { path: "test", element: <h1>tests</h1> },
        ],
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute expectedRoles={[userRoles.ADMIN]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "opciones", element: <OpcionesAdmin />},
          { path: "trabajadores", element: <ListadoTrabajador/>},
          { path: "empresas", element: <ListadoEmpresa /> },
          { path: "capacitaciones", element: <ListaCapacitaciones/> },
          { path: "test", element: <h1>test</h1> },
          { path: "reportes", element: <OpcionesReportes/> },
        ],
      },

      { path: "*", element: <Menu /> },
    ],
  },
    {
    path: "/admin",
    element: (
      <ProtectedRoute expectedRoles={[userRoles.ADMIN]}>
        <Menu />
      </ProtectedRoute>
    ),
    children: [
      { path: "opciones", element: <h1>seccion trabajadores</h1> },
      { path: "empresas", element: <h1>seccion empresas</h1> },
      { path: "capacitaciones", element: <h1>seccion capacitaciones</h1> },
      { path: "reportes", element: <h1>seccion reportes</h1> },
      { path: "*", element: <Menu /> },
    ],
  },
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/",
    element: <Navigate to="/hola" />,
  },
  {
    path: "*",
    element: <NotFound404 />,
  },
]);

export default router;
