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
import ListadoTest from "../pages/administrador/test/ListadoTest";
import ReporteExameAsistencia from "../pages/administrador/reportes/ReporteExameAsistencia";
import ReporteCertificado from "../pages/administrador/reportes/ReporteCertificado";
import TestTrabajador from "../pages/trabajador/capacitaciones/TestTrabajador";

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
          <ProtectedRoute expectedRoles={[userRoles.EMPLOYEE]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "opciones", element: <OpcionesTrabajador /> },
          { path: "capacitaciones", element: <CapacitacionesTrabajador /> },
          { path: "test", element: <TestTrabajador/> },
          { path: "*", element: <Navigate to="/menu/trabajador/opciones" /> },
        ],
      },
      { path: "*", element: <Navigate to="/menu" /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute expectedRoles={[userRoles.ADMIN]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "opciones", element: <OpcionesAdmin /> },
          { path: "trabajadores", element: <ListadoTrabajador /> },
          { path: "empresas", element: <ListadoEmpresa /> },
          { path: "capacitaciones", element: <ListaCapacitaciones /> },
          { path: "test", element: <ListadoTest /> },
          {
            path: "reportes",
            element: <Outlet />,
            children: [
              { path: "opciones", element: <OpcionesReportes /> },
              {
                path: "asistencias",
                element: (
                  <ReporteExameAsistencia
                    titulo={"Reporte asistencias"}
                    esExamen={false}
                  />
                ),
              },
              {
                path: "examenes",
                element: (
                  <ReporteExameAsistencia
                    titulo={"Reporte de examenes"}
                    esExamen={true}
                  />
                ),
              },
              { path: "certificados", element: <ReporteCertificado /> },
            ],
          },
          { path: "*", element: <Navigate to="/menu/admin/opciones" /> },
        ],
      },
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
