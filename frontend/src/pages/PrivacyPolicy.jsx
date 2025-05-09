import React from "react";
import LegalPage from "../components/LegalPage";

const PrivacyPolicy = () => {
  const content = (
    <>
      <p>En ATLAS COMPANY, respetamos su privacidad y nos comprometemos a proteger sus datos personales...</p>
      <ul className="list-disc list-inside">
        <li>Recopilación de Datos: Información proporcionada por el usuario...</li>
        <li>Uso de Datos: Para mejorar nuestros servicios y personalizar la experiencia...</li>
        <li>Compartir Datos: No compartimos datos personales sin su consentimiento...</li>
        <li>Seguridad: Implementamos medidas para proteger su información...</li>
      </ul>
    </>
  );

  return <LegalPage title="Política de Privacidad" content={content} />;
};

export default PrivacyPolicy;