import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router";
import router from "./routes/RouterConfig";
import AuthProvider from "./context/auth/authProvider";
import { ProSidebarProvider } from "react-pro-sidebar";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";

//styles
import "./styles/global.css";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "./components/loader/Loader";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ProSidebarProvider>

          <RouterProvider router={router} />

        </ProSidebarProvider>
      </QueryClientProvider>
      <ToastContainer autoClose={2000}/>
      <Loader/>
    </AuthProvider>
  </React.StrictMode>
);
