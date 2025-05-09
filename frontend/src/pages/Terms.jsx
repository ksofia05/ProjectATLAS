import React from "react";
import LegalPage from "../components/LegalPage";

const Terms = () => {
  const content = (
    <>
      <p>Bienvenido a ATLAS COMPANY. Estos Términos y Condiciones regulan el uso de nuestro software...</p>
      <ul className="list-disc list-inside">
        <li>Servicios Ofrecidos: Gestión de inventario, seguimiento de equipos...</li>
        <li>Acceso al Servicio: Crear una cuenta y proporcionar información precisa...</li>
        <li>Uso Aceptable: Cumplir con las leyes aplicables y no interferir con el sistema...</li>
        <li>Propiedad Intelectual: Todos los derechos reservados a ATLAS COMPANY...</li>
      </ul>
    </>
  );

  return <LegalPage title="Términos y Condiciones" content={content} />;
};

export default Terms;