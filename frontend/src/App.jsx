import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Importar el AuthProvider
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/Home/homepage";

// Autenticación
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PasswordRecovery from "./pages/Auth/PasswordRecovery";
import EmailRecovery from "./pages/Auth/EmailRecovery";
import PasswordReset from "./pages/Auth/PasswordReset";

// Legales
import Terms from "./pages/Legal/Terms";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";

// Dashboard y secciones
import DashboardLayout from "./pages/Dashboard/DashboardHome";
import DashboardMain from "./pages/Dashboard/DashboardMain";
import CalendarPage from "./pages/Dashboard/CalendarPage";
import InventoryPage from "./pages/Dashboard/InventoryPage";
import CollaboratorsPage from "./pages/Dashboard/CollaboratorsPage";
import ProfilePage from "./pages/Profile/ProfilePage";

import DashboardCreateProject from "./pages/DashboardCreateProject";
import Error404 from "./pages/error404";
import { Toaster } from 'react-hot-toast';
import NoTenerCuenta from "./components/common/NoTenerCuenta";
import InvitacionProyectoRoute from "./components/common/InvitacionProyectpRoute";

const App = () => {
  return (
    <AuthProvider> {/* Envolver toda la app con AuthProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/registrarse" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
          <Route path="/email-recuperacion" element={<EmailRecovery />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          
          <Route path="/terminos" element={<Terms />} />
          <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
          <Route path="/notenercuenta" element={<NoTenerCuenta />} />
          <Route path="/invitacion-proyecto/:id" element={<InvitacionProyectoRoute />} />
          
          {/* Rutas protegidas - permiten acceso sin rol */}
          <Route
            path="/dashboard-create-project"
            element={
              <ProtectedRoute allowWithoutRole={true}>
                <DashboardCreateProject />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas anidadas para dashboard */}
          <Route
            path="/dashboard/:id"
            element={
              <ProtectedRoute allowWithoutRole={true}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardMain />} />
            <Route path="calendario" element={<CalendarPage />} />
            <Route path="colaboradores" element={<CollaboratorsPage />} />
            <Route path="inventario" element={<InventoryPage />} />
          </Route>
          
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute allowWithoutRole={true}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Error404 />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;