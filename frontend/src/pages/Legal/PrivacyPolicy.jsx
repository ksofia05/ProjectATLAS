import React from "react";
import LegalPage from "../../components/legal/LegalPage";

const PrivacyPolicy = () => {
  const content = (
    <>
      <p className="text-center text-gray-400 mb-6">
        Última actualización: 24/09/2025
      </p>
      <div className="bg-[#171722] border border-slate-800/40 rounded-2xl p-6 text-gray-300 text-base space-y-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-2">
          • Información que Recopilamos
        </h2>
        <p>
          ATLAS COMPANY puede recopilar la siguiente información personal cuando
          usted solicita nuestros servicios:
        </p>
        <ul className="list-disc pl-6">
          <li>Nombre completo.</li>
          <li>
            Información de contacto (teléfono, correo electrónico, dirección).
          </li>
          <li>
            Información relacionada con su institución o empresa (nombre,
            ubicación, necesidades de contacto).
          </li>
          <li>Historial de uso de nuestros servicios.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mb-2">
          • Uso de la Información
        </h2>
        <p>La información recopilada se utiliza para:</p>
        <ul className="list-disc pl-6">
          <li>
            Proveer y gestionar nuestros servicios de conectividad y software de
            gestión de inventario.
          </li>
          <li>
            Comunicarnos con usted sobre el estado de los servicios,
            actualizaciones o solicitudes de soporte.
          </li>
          <li>
            Enviar notificaciones, novedades o promociones (solo si usted ha
            dado su consentimiento previo).
          </li>
          <li>Cumplir con obligaciones legales y regulatorias.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mb-2">
          • Confidencialidad y Protección de Datos
        </h2>
        <p>
          ATLAS COMPANY se compromete a mantener su información segura.
          Implementamos medidas técnicas y organizativas adecuadas para proteger
          sus datos contra el acceso no autorizado, pérdida, destrucción o
          divulgación. Solo el personal autorizado tendrá acceso a su
          información, y estos están obligados a respetar la confidencialidad de
          la misma.
        </p>

        <h2 className="text-xl font-bold text-white mb-2">
          • Compartición de Información con Terceros
        </h2>
        <p>
          ATLAS COMPANY no vende, alquila ni comparte su información personal
          con terceros, salvo en los siguientes casos:
        </p>

        <ul className="list-disc pl-6">
          <li>
            Cuando es necesario para cumplir con requisitos legales o
            regulatorios.
          </li>
          <li>
            Con proveedores o socios que nos ayudan a brindar nuestros
            servicios, siempre bajo estrictas condiciones de confidencialidad.
          </li>
          <li>
            Si usted da su consentimiento explícito para compartir su
            información con terceros.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mb-2">
          • Retención de Datos
        </h2>
        <p>
          ATLAS COMPANY conservará su información personal solo durante el
          tiempo necesario para cumplir con los fines para los cuales fue
          recopilada o para cumplir con las obligaciones legales aplicables. Una
          vez que la información ya no sea necesaria, será eliminada de manera
          segura.
        </p>

        <h2 className="text-xl font-bold text-white mb-2">
          • Derechos del Usuario
        </h2>
        <p>Usted tiene el derecho de:</p>
        <ul className="list-disc pl-6">
          <li>
            Acceder a la información personal que hemos recopilado sobre usted.
          </li>
          <li>Solicitar la corrección de datos inexactos o incompletos.</li>
          <li>
            Solicitar la eliminación de sus datos personales (sujeto a
            obligaciones legales).
          </li>
          <li>Oponerse al uso de su información para fines de marketing.</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, puede contactarnos a través
          de los medios indicados al final de esta política.
        </p>

        <h2 className="text-xl font-bold text-white mb-2">
          • Cookies y Tecnologías Similares
        </h2>
        <p>
          ATLAS COMPANY puede utilizar cookies y otras tecnologías similares en
          su sitio web para mejorar la experiencia del usuario, analizar el
          tráfico y personalizar el contenido. Usted puede configurar su
          navegador para rechazar las cookies si lo prefiere, aunque esto podría
          afectar la funcionalidad del sitio.
        </p>

        <h2 className="text-xl font-bold text-white mb-2">
          • Enlaces a Sitios de Terceros
        </h2>
        <p>
          Nuestro sitio web puede contener enlaces a otros sitios web que no
          están bajo nuestro control. ATLAS COMPANY no se responsabiliza por las
          prácticas de privacidad o el contenido de esos sitios de terceros. Le
          recomendamos que revise sus políticas de privacidad antes de
          proporcionarles cualquier información.
        </p>

        <h2 className="text-xl font-bold text-white mb-2">
          • Cambios en la Política de Privacidad
        </h2>
        <p>
          ATLAS COMPANY se reserva el derecho de actualizar esta Política de
          Privacidad en cualquier momento. Las actualizaciones se publicarán en
          nuestro sitio web, y le recomendamos revisar esta política
          periódicamente. El uso continuo de nuestros servicios después de
          cualquier cambio constituye la aceptación de los mismos.
        </p>

        <h2 className="text-xl font-bold text-white mb-2">• Contacto</h2>
        <p>
          Si tiene alguna pregunta o inquietud sobre esta Política de Privacidad
          o sobre cómo manejamos su información personal, puede contactarnos a
          través de:
        </p>
        <ul className="list-disc pl-6">
          <li>
            Correo electrónico:{" "}
            <a
              href="mailto:contacto@atlascompany.com"
              className="text-purple-400 hover:underline"
            >
              contacto@atlascompany.com
            </a>
          </li>
          <li>Teléfono: +57 301 243 3965</li>
          <li>Dirección: Calle 100 #10-20, Oficina 50</li>
        </ul>
        <p>
          Al utilizar los servicios de ATLAS COMPANY, usted acepta esta Política
          de Privacidad y consiente la recopilación, uso y protección de su
          información personal según lo descrito en este documento.
        </p>
      </div>
    </>
  );

  return (
    <LegalPage
      title="Política de Privacidad de ATLAS COMPANY"
      content={content}
    />
  );
};

export default PrivacyPolicy;
