import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
// import Navbar from "./components/navbar/navbar";
import HomePage from "./pages/Home/homepage"; //Landing page Venta
// import Resgistrarse from "./components/resgistrarse";
// import IniciarSesion from "./components/iniciarSesion";
// import SobreNosotros from "./pages/sobreNosotros"; // ruta quienes somos
// import PoliticasPrivacidad from "./components/politicasPrivacidad"; // ruta politica de privacidad
// import TerminosCond from "./components/terminosCond"; // ruta terminos y condiciones

//Importaciones de Luis (Autenticacion)
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PasswordRecovery from "./pages/Auth/PasswordRecovery";
import EmailRecovery from "./pages/Auth/EmailRecovery";
import PasswordReset from "./pages/Auth/PasswordReset";
import Terms from "./pages/Legal/Terms";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import Simulation from "./pages/Simulation";
// import Error404 from "./pages/Error404";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registrarse" element={<Resgistrarse />} />
        <Route path="/politica-de-privacidad" element={<PoliticasPrivacidad />} />*/}       
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
        <Route path="/email-recuperacion" element={<EmailRecovery />} />
        <Route path="/password-reset/:token" element={<PasswordReset />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
        <Route path="/simulacion" element={
          <ProtectedRoute>
            <Simulation />
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
