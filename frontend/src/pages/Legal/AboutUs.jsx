import React from "react";
import LegalPage from "../../components/legal/LegalPage";

const AboutUs = () => {
  const content = (
    <>
      <p className="text-center text-gray-400 mb-6">
        Conoce más sobre ATLAS COMPANY
      </p>
      <div className="text-gray-300 text-sm space-y-4">
        <h2 className="text-lg font-semibold text-white">• Nuestra Misión</h2>
        <p>
          En ATLAS COMPANY nos dedicamos a proporcionar soluciones tecnológicas
          innovadoras para la gestión de inventarios y reparación de equipos.
        </p>

        <h2 className="text-lg font-semibold text-white">• Nuestra Visión</h2>
        <p>
          Ser la empresa líder en software de gestión para microempresas
          dedicadas a la reparación de equipos tecnológicos.
        </p>

        <h2 className="text-lg font-semibold text-white">• Contacto</h2>
        <p>
          Para más información, puedes contactarnos en:
          <br />
          Email: contacto@atlascompany.com
          <br />
          Teléfono: +57 301 243 3965
        </p>
      </div>
    </>
  );

  return <LegalPage title="Acerca de ATLAS COMPANY" content={content} />;
};

export default AboutUs;
