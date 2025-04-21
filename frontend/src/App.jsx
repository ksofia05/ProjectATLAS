import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import HomePage from './pages/homepage'; //Landing page Venta
import Resgistrarse from './components/resgistrarse';
import IniciarSesion from './components/iniciarSesion';
import SobreNosotros from './pages/sobreNosotros'; // ruta quienes somos
import PoliticasPrivacidad from './components/politicasPrivacidad'; // ruta politica de privacidad
import TerminosCond from './components/terminosCond'; // ruta terminos y condiciones


const App = () => {
  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registrarse" element={<Resgistrarse />} />
        <Route path="/politica-de-privacidad" element={<PoliticasPrivacidad />} />
        <Route path="/terminos-y-condiciones" element={<TerminosCond />} />
        </Routes>
    </BrowserRouter>
  );
};

export default App;
