import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router";
import router from "./routes/RouterConfig";
import AuthProvider from "./context/auth/authProvider";
import { ProSidebarProvider } from "react-pro-sidebar";

import { ToastContainer } from "react-toastify";

//styles
import "./styles/global.css";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "./components/loader/Loader";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
        <ProSidebarProvider>

          <RouterProvider router={router} />

        </ProSidebarProvider>
      <ToastContainer autoClose={2000}/>
      <Loader/>
    </AuthProvider>
  </React.StrictMode>
);
