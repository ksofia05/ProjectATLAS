import React from "react";
import LegalPage from "../../components/LegalPage";

const Terms = () => {
  const content = (
    <>
      <p className="text-center text-gray-400 mb-6">
        Última actualización: 13/04/2025
      </p>
      <div className="text-gray-300 text-sm space-y-4">
        <h2 className="text-lg font-semibold text-white">• Introducción</h2>
        <p>
          Bienvenido a ATLAS COMPANY. Estos Términos y Condiciones regulan el
          uso de nuestro software de gestión de inventarioen línea, diseñado
          especialmente para empresas dedicadas a la reparación de equipos como
          computadores. Al acceder o utilizar nuestros servicios, usted acepta
          cumplir con estos términos. Por favor, léalos detenidamente antes de
          continuar.
        </p>

        <h2 className="text-lg font-semibold text-white">• Servicios Ofrecidos</h2>
        <p>
          ATLAS COMPANY ofrece un sistema en línea para la gestión de
          inventario, seguimiento de equipos en reparación,asignación de tareas
          a colaboradores, y registro de clientes. El software está disponible
          para empresas que deseen digitalizar y optimizar su flujo de trabajo.
        </p>

        <h2 className="text-lg font-semibold text-white">• Acceso al Servicio</h2>
        <p>
          Para acceder a nuestro sistema, debe crear una cuenta y proporcionar
          información precisa y actualizada. Usted es responsable de mantener la
          confidencialidad de sus credenciales de acceso y de todas las
          actividades que ocurran en su cuenta.
        </p>

        <h2 className="text-lg font-semibold text-white">• Uso aceptable</h2>
        <p>
          El usuario se compromete a utilizar el sistema de forma legal y ética.
          Está prohibido utilizar el software para fines ilícitos, enviar
          contenido malicioso o interferir con el funcionamiento del sistema.
        </p>

        <h2 className="text-lg font-semibold text-white">
          • Propiedad Intelectual
        </h2>
        <p>
          Todos los derechos sobre el software, su diseño, código fuente,
          interfaz y funcionalidades pertenecen a ATLAS COMPANY.Se prohíbe su
          reproducción, modificación o distribución sin autorización expresa.
        </p>

        <h2 className="text-lg font-semibold text-white">
          • Soporte y Actualizaciones
        </h2>
        <p>
          ATLAS COMPANY ofrece soporte técnico y actualizaciones periódicas al
          sistema, las cuales podrán incluir mejoras,parches de seguridad y
          nuevas funcionalidades. Nos reservamos el derecho de realizar
          mantenimientos programados que puedan afectar temporalmente la
          disponibilidad del servicio.
        </p>

        <h2 className="text-lg font-semibold text-white">
          • Limitaciones de Responsabilidad
        </h2>
        <p>
          ATLAS COMPANY no se hace responsable por pérdida de datos ocasionada
          por errores del usuario, fallos de conexión o fuerza mayor. Se
          recomienda realizar copias de seguridad periódicas.
        </p>

        <h2 className="text-lg font-semibold text-white">
          • Política de Privacidad
        </h2>
        <p>
          La información de los usuarios se manejará con confidencialidad y
          según nuestra Política de Privacidad. No compartimos datos personales
          con terceros sin consentimiento, salvo por obligaciones legales.
        </p>

        <h2 className="text-lg font-semibold text-white">
          • Cancelación y Terminación
        </h2>
        <p>
          Usted puede cancelar su suscripción en cualquier momento. ATLAS
          COMPANY se reserva el derecho de suspender o cancelar cuentas que
          incumplan estos términos, sin previo aviso.
        </p>

        <h2 className="text-lg font-semibold text-white">
          • Modificaciones de los Términos
        </h2>
        <p>
          Nos reservamos el derecho de modificar estos Términos y Condiciones.
          Las actualizaciones se publicarán en nuestra plataforma y entrarán en
          vigor inmediatamente. Su uso continuado del servicio implica
          aceptación de dichos cambios.
        </p>

        <h2 className="text-lg font-semibold text-white">• Contacto</h2>
        <p>
          Si tiene preguntas o comentarios sobre estos Términos y Condiciones,
          puede comunicarse con nosotros a través de:
        </p>
        <ul>
          <li>
            {" "}
            Correo electrónico:{" "}
            <a href="terminos.html">contacto@atlascompany.com</a>
          </li>
          <li> Teléfono: +57 301 243 3965</li>
        </ul>
        <p>
          Al utilizar los servicios de ATLAS COMPANY, usted declara que ha
          leído, comprendido y aceptado estos Términos y Condiciones en su
          totalidad.
        </p>
      </div>
    </>
  );

  return (
    <LegalPage
      title="Términos y Condiciones de ATLAS COMPANY"
      content={content}
    />
  );
};

export default Terms;
