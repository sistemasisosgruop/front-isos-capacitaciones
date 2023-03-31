import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router';
import router from './routes/RouterConfig';
import AuthProvider from './context/auth/authProvider';
import { ProSidebarProvider } from 'react-pro-sidebar';

//styles
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ProSidebarProvider>
        <RouterProvider router={ router } />
      </ProSidebarProvider>
    </AuthProvider>
  </React.StrictMode>
)
