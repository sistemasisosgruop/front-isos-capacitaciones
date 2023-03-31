import { createBrowserRouter, Navigate } from 'react-router-dom';
import Index from '../pages/index/Index';
import Menu from '../pages/menu/Menu';
import '../styles/global.css';
import { userRoles } from './constantsRoles';
import ProtectedRoute from './protectetRoute';

const router = createBrowserRouter([
  {
    path: '/menu',
    element: (
    <ProtectedRoute expectedRoles={[userRoles.ADMIN]}>
      <Menu />
    </ProtectedRoute>
    ),
    children: [
        { path: 'trabajadores', element: <h1>seccion trabajadores</h1>,  },
        { path: 'empresas', element: <h1>seccion empresas</h1> },
        { path: 'capacitaciones', element: <h1>seccion capacitaciones</h1> },
        { path: 'reportes', element: <h1>seccion reportes</h1> },
        { path: '*', element: <Menu /> },
    ]
  },
  {
    path: '/',
    element: <Index/>
  },
  {
    path: '/',
    element: <Navigate to="/hola" />
  },
  {
    path: '*',
    element: <h1>Not found</h1>,
  },
]); 

export default router;
