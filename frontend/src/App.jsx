import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/Home/homepage"; //Landing page Venta

//Importaciones de Luis (Autenticacion)
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PasswordRecovery from "./pages/Auth/PasswordRecovery";
import EmailRecovery from "./pages/Auth/EmailRecovery";
import PasswordReset from "./pages/Auth/PasswordReset";
import Terms from "./pages/Legal/Terms";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import DashboardCreateProject from "./pages/DashboardCreateProject";
import Error404 from "./pages/error404";
import { Toaster } from 'react-hot-toast';
import Dashboard from "./pages/Dashboard";
import NoTenerCuenta from "./components/common/notenercuenta";
import InvitacionProyectoRoute from "./components/common/InvitacionProyectpRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />     
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
        <Route path="/email-recuperacion" element={<EmailRecovery />} />
        <Route path="/password-reset/:token" element={<PasswordReset />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
        <Route path="/notenercuenta" element={<NoTenerCuenta />} />
        <Route path="/invitacion-proyecto/:id" element={<InvitacionProyectoRoute />} />
        <Route path="/dashboard-create-project" element={
          <ProtectedRoute>
            <DashboardCreateProject />
          </ProtectedRoute>
        }/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }/>
        <Route path="/dashboard/:id" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }/>
       
        <Route path="*" element={<Error404 />}/>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;