import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import HomePage from './pages/homepage'; //Landing page Venta
import Resgistrarse from './components/resgistrarse';
import IniciarSesion from './components/iniciarSesion';
import SobreNosotros from './pages/sobreNosotros'; // ruta quienes somos
import PoliticasPrivacidad from './components/politicasPrivacidad'; // ruta politica de privacidad
import TerminosCond from './components/terminosCond'; // ruta terminos y condiciones

//Importaciones de Luis (Autenticacion)
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordRecovery from "./pages/PasswordRecovery";
import EmailRecovery from "./pages/EmailRecovery";
import PasswordReset from "./pages/PasswordReset";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Simulation from "./pages/Simulation";

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registrarse" element={<Resgistrarse />} />
        <Route path="/politica-de-privacidad" element={<PoliticasPrivacidad />} />
        <Route path="/terminos-y-condiciones" element={<TerminosCond />} /> */}
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
        <Route path="/email-recuperacion" element={<EmailRecovery />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
        <Route path="/simulacion" element={<Simulation />} />
      </Routes>
    </BrowserRouter>

  );
};

export default App;
