import React from "react";
import LegalPage from "../components/LegalPage";

const PrivacyPolicy = () => {
  const content = (
    <>
      <p class="text-center text-gray-400 mb-6">Última actualización: 13/04/2025</p>
      <div class="text-gray-300 text-sm space-y-4">
        <h2 class="text-lg font-semibold text-white">• Información que Recopilamos</h2>
            <p>ATLAS COMPANY puede recopilar la siguiente información personal cuando usted solicita nuestros servicios:</p>
            <ul>
                <li>Nombre completo.</li>
                <li>Información de contacto (teléfono, correo electrónico, dirección).</li>
                <li>Información relacionada con su institución o empresa (nombre, ubicación, necesidades de contacto).</li>
                <li>Historial de uso de nuestros servicios.</li>
            </ul>

            <h2 class="text-lg font-semibold text-white">• Uso de la Información</h2>
            <p>La información recopilada se utiliza para:</p>
            <ul>
                <li>Proveer y gestionar nuestros servicios de conectividad y software de gestión de inventario.</li>
                <li>Comunicarnos con usted sobre el estado de los servicios, actualizaciones o solicitudes de soporte.</li>
                <li>Enviar notificaciones, novedades o promociones (solo si usted ha dado su consentimiento previo).</li>
                <li>Cumplir con obligaciones legales y regulatorias.</li>
            </ul>

            <h2 class="text-lg font-semibold text-white">• Confidencialidad y Protección de Datos</h2>
            <p>ATLAS COMPANY se compromete a mantener su información segura. Implementamos medidas técnicas y organizativas adecuadas para proteger sus datos contra el acceso no autorizado, pérdida, destrucción o divulgación. Solo el personal autorizado tendrá acceso a su información, y estos están obligados a respetar la confidencialidad de la misma.</p>


            <h2 class="text-lg font-semibold text-white">• Compartición de Información con Terceros</h2>
            <p>ATLAS COMPANY no vende, alquila ni comparte su información personal con terceros, salvo en los siguientes casos:</p>

            <ul>
                <li>Cuando es necesario para cumplir con requisitos legales o regulatorios.</li>
                <li>Con proveedores o socios que nos ayudan a brindar nuestros servicios, siempre bajo estrictas condiciones de confidencialidad.</li>
                <li>Si usted da su consentimiento explícito para compartir su información con terceros.</li>
            </ul>
            <h2 class="text-lg font-semibold text-white">• Retención de Datos</h2>
            <p>ATLAS COMPANY conservará su información personal solo durante el tiempo necesario para cumplir con los fines para los cuales fue recopilada o para cumplir con las obligaciones legales aplicables. Una vez que la información ya no sea necesaria,será eliminada de manera segura.</p>

    
            <h2 class="text-lg font-semibold text-white">• Derechos del Usuario</h2>
            <p>Usted tiene el derecho de:</p>
            <ul>
                <li>Acceder a la información personal que hemos recopilado sobre usted.</li>
                <li>Solicitar la corrección de datos inexactos o incompletos.</li>
                <li>Solicitar la eliminación de sus datos personales (sujeto a obligaciones legales).</li>
                <li>Oponerse al uso de su información para fines de marketing.</li>
            </ul>
            <p>Para ejercer cualquiera de estos derechos, puede contactarnos a través de los medios indicados al final de esta política.</p>


            <h2 class="text-lg font-semibold text-white">• Cookies y Tecnologías Similares</h2>
            <p>ATLAS COMPANY puede utilizar cookies y otras tecnologías similares en su sitio web para mejorar la experiencia del usuario, analizar el tráfico y personalizar el contenido. Usted puede configurar su navegador para rechazar las cookies si lo prefiere, aunque esto podría afectar la funcionalidad del sitio.</p>


            <h2 class="text-lg font-semibold text-white">• Enlaces a Sitios de Terceros</h2>
            <p>Nuestro sitio web puede contener enlaces a otros sitios web que no están bajo nuestro control. ATLAS COMPANY no se responsabiliza por las prácticas de privacidad o el contenido de esos sitios de terceros. Le recomendamos que revise sus políticas de privacidad antes de proporcionarles cualquier información.</p>

            <h2 class="text-lg font-semibold text-white">• Cambios en la Política de Privacidad</h2>
            <p>ATLAS COMPANY se reserva el derecho de actualizar esta Política de Privacidad en cualquier momento. Las actualizacionesse publicarán en nuestro sitio web, y le recomendamos revisar esta política periódicamente. El uso continuo de nuestros servicios después de cualquier cambio constituye la aceptación de los mismos.</p>

            

            <h2 class="text-lg font-semibold text-white">• Contacto</h2>
            <p>Si tiene alguna pregunta o inquietud sobre esta Política de Privacidad o sobre cómo manejamos su información personal,puede contactarnos a través de:</p>
            <ul>
                <li> Correo electrónico: <a href="politicas.html">contacto@atlascompany.com</a></li>
                <li> Teléfono: +57 301 243 3965</li>
                <li> Dirección: Calle 100 #10-20, Oficina 50</li>
            </ul>
            <p>Al utilizar los servicios de ATLAS COMPANY, usted acepta esta Política de Privacidad y consiente la recopilación, uso y protección de su información personal según lo descrito en este documento.</p>
      </div>
    </>
  );

  return <LegalPage title="Política de Privacidad de ATLAS COMPANY" content={content} />;
};

export default PrivacyPolicy;