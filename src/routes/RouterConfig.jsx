import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Index from "../pages/index/Index";
import Menu from "../pages/Menu";
import NotFound404 from "../pages/notFound404/NotFound404";
import "../styles/global.css";
import { userRoles } from "./constantsRoles";
import ProtectedRoute from "./ProtectetRoute";
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
import ReporteExamenRecuperacion from "../pages/administrador/reportes/ReporteExamenRecuperacion";
import ReporteCertificadosTrabajador from "../pages/trabajador/certificados/reporteCertificadosTrabajador";
import TestTrabajador from "../pages/trabajador/capacitaciones/TestTrabajador";
import validateToken from "./validateToken";
import OpcionesEmos from "../pages/administrador/emos/opcionesReportes";
import OpcionesSends from "../pages/administrador/sends/opcionesReportes";
import OpcionesSendsEmos from "../pages/supervisor/emos/opcionesReportes";
import EvaluacionMedica from "../pages/trabajador/evaluacionMedica/EvaluacionMedica";
import ReporteEmo from "../pages/administrador/reportes/ReporteEmo";
import CompararTrabajadores from "../pages/administrador/ListaTrabajadores/CompararTrabajadores";
import OpcionesCapacitador from "../pages/capacitador/OpcionesCapacitador";
import OpcionesSupervisor from "../pages/supervisor/OpcionesSupervisor";
import ReporteExameAsistenciaCapacitador from "../pages/capacitador/ReporteExameAsistenciaCapacitador";
import ReporteCertificadoCapacitador1 from "../pages/capacitador/ReporteCertificadoCapacitador1";
import ReporteExameAsistenciaSupervisor from "../pages/supervisor/ReporteExameAsistenciaSupervisor";
import ReporteCertificadoSupervisor1 from "../pages/supervisor/ReporteCertificadoSupervisor1";
import ReporteExamenRecuperacionSupervisor from '../pages/supervisor/ReporteExamenRecuperacionSupervisor'
import ReporteConstancias from "../pages/administrador/reportes/ReporteConstancias"

const router = createBrowserRouter([
  {
    path: "/menu",
    loader: validateToken,
    element: (
      <ProtectedRoute
        expectedRoles={[
          userRoles.ADMIN,
          userRoles.EMPLOYEE,
          userRoles.SUPERVISOR,
          userRoles.CAPACITADOR,
        ]}
      >
        <Menu />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "capacitador",
        loader: validateToken,
        element: (
          <ProtectedRoute expectedRoles={[userRoles.CAPACITADOR]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "opciones", element: <OpcionesTrabajador /> },
          { path: "capacitaciones", element: <ListaCapacitaciones /> },
          { path: "capacitador", element: <CapacitacionesTrabajador /> },
          { path: "test", element: <TestTrabajador /> },
          { path: "evaluacion", element: <EvaluacionMedica /> },
          {
            path: "reportes",
            element: <Outlet />,
            children: [
              { path: "opciones", element: <OpcionesCapacitador /> },
              {
                path: "examenes",
                element: (
                  <ReporteExameAsistenciaCapacitador
                    titulo={"Reporte de examenes"}
                    esExamen={true}
                  />
                ),
              },
              {
                path: "certificados",
                element: <ReporteCertificadoCapacitador1 />,
              },
            ],
          },
          { path: "*", element: <Navigate to="/menu/capacitador/opciones" /> },
        ],
      },
      {
        path: "supervisor",
        loader: validateToken,
        element: (
          <ProtectedRoute expectedRoles={[userRoles.SUPERVISOR]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "opciones", element: <OpcionesTrabajador /> },
          { path: "capacitaciones", element: <CapacitacionesTrabajador /> },
          { path: "test", element: <TestTrabajador /> },
          { path: "evaluacion", element: <EvaluacionMedica /> },
          { path: "certificados", element: <ReporteCertificadosTrabajador /> },
          {
            path: "constancia",
            element: <Outlet />,
            children: [{ path: "opciones", element: <OpcionesSendsEmos /> }],
          },
          {
            path: "reportes",
            element: <Outlet />,
            children: [
              { path: "opciones", element: <OpcionesSupervisor /> },
              {
                path: "examenes",
                element: (
                  <ReporteExameAsistenciaSupervisor
                    titulo={"Reporte de examenes"}
                    esExamen={true}
                  />
                ),
              },
              {
                path: "certificados",
                element: <ReporteCertificadoSupervisor1 />,
              },
              {
                path: "recuperacion",
                element: (
                  <ReporteExamenRecuperacionSupervisor
                    titulo={"Reporte de recuperacion de examenes"}
                  />
                ),
              },
            ],
          },
          { path: "*", element: <Navigate to="/menu/supervisor/opciones" /> },
        ],
      },
      {
        path: "trabajador",
        loader: validateToken,
        element: (
          <ProtectedRoute expectedRoles={[userRoles.EMPLOYEE]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "opciones", element: <OpcionesTrabajador /> },
          { path: "capacitaciones", element: <CapacitacionesTrabajador /> },
          { path: "certificados", element: <ReporteCertificadosTrabajador /> },
          { path: "test", element: <TestTrabajador /> },
          { path: "evaluacion", element: <EvaluacionMedica /> },
          { path: "*", element: <Navigate to="/menu/trabajador/opciones" /> },
        ],
      },
      { path: "*", element: <Navigate to="/menu" /> },
      {
        path: "admin",
        loader: validateToken,
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
          { path: "lista", element: <CompararTrabajadores /> },

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
              {
                path: "recuperacion",
                element: (
                  <ReporteExamenRecuperacion
                    titulo={"Reporte de recuperacion de examenes"}
                  />
                ),
              },
              {
                path: "constancias",
                element: (
                  <ReporteConstancias
                    titulo={"Reporte de emision de constancias"}
                  />
                ),
              },
              { path: "certificados", element: <ReporteCertificado /> },
              { path: "emos", element: <ReporteEmo /> },
            ],
          },
          {
            path: "constancia",
            element: <Outlet />,
            children: [{ path: "opciones", element: <OpcionesEmos /> }],
          },
          {
            path: "emos",
            element: <Outlet />,
            children: [{ path: "opciones", element: <OpcionesSends /> }],
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
