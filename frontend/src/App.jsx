import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/Home/homepage";
import AboutUsPage from "./pages/Home/AboutUsPage";

// Autenticación
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PasswordRecovery from "./pages/Auth/PasswordRecovery";
import EmailRecovery from "./pages/Auth/EmailRecovery";
import PasswordReset from "./pages/Auth/PasswordReset";

// Legales
import Terms from "./pages/Legal/Terms";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import AboutUs from "./pages/Legal/AboutUs";

// Dashboard y secciones
import DashboardLayout from "./pages/Dashboard/DashboardHome"; // Este será el layout con sidebar/navbar
import DashboardMain from "./pages/Dashboard/DashboardMain"; // El contenido principal del dashboard
import CalendarPage from "./pages/Dashboard/CalendarPage";
import InventoryPage from "./pages/Dashboard/InventoryPage";
import CollaboratorsPage from "./pages/Dashboard/CollaboratorsPage";
import ProfilePage from "./pages/Profile/ProfilePage";

import DashboardCreateProject from "./pages/DashboardCreateProject";
import Error404 from "./pages/error404";
import { Toaster } from "react-hot-toast";
import NoTenerCuenta from "./components/common/NoTenerCuenta";
import InvitacionProyectoRoute from "./components/common/InvitacionProyectpRoute";
import CalendarAdvancedPage from "./pages/Dashboard/CalendarAdvancedPage";
import { AuthProvider } from "./context/AuthProvider";
import { NavbarTitleProvider } from "./context/NavbarTitleContext";


const App = () => {
  return (
      <BrowserRouter>
      <AuthProvider>
      <NavbarTitleProvider>
      <Routes>

        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/quienes-somos" element={<AboutUsPage />} />
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
        <Route path="/email-recuperacion" element={<EmailRecovery />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
        <Route path="/sobre-nosotros" element={<AboutUs />} />
        <Route path="/notenercuenta" element={<NoTenerCuenta />} />
        <Route
          path="/invitacion-proyecto/:id"
          element={<InvitacionProyectoRoute />}
        />
        <Route
          path="/dashboard-create-project"
          element={
            <ProtectedRoute>
              <DashboardCreateProject />
            </ProtectedRoute>
          }
        />
        {/* Rutas anidadas para dashboard */}
        <Route
          path="/dashboard/:id"
          element={
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardMain />} />
          <Route path="calendario" element={<CalendarPage />} />
          <Route
            path="calendario-avanzado"
            element={<CalendarAdvancedPage />}
          />
          <Route path="colaboradores" element={<CollaboratorsPage />} />
          <Route path="inventario" element={<InventoryPage />} />
        </Route>
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Toaster />
      </NavbarTitleProvider>
      </AuthProvider >
    </BrowserRouter>
  );
};

export default App;
