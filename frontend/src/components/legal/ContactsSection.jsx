import React from "react";

const ContactsSection = () => (
  <section className="relative py-16 px-6 lg:px-16 md:py-24 overflow-hidden">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-start gap-12">
      <div className="w-full md:w-1/2 text-left text-white">
        <h2 className="font-['Figtree'] text-4xl md:text-6xl lg:text-8xl font-bold mb-4 text-white">
          Contáctanos
        </h2>
        <h3 className="font-['Figtree'] text-base md:text-3xl lg:text-4xl text-purple-300 mb-4">
          Mantengamos la comunicación
        </h3>
        <div className="text-lg md:text-xl text-gray-300 mb-8 space-y-4">
          <p>
            Correo: <a href="mailto:atlas.inovationcompany@gmail.com" className="text-purple-300 underline hover:text-purple-100 transition-colors">atlas.inovationcompany@gmail.com</a>
          </p>
          <p>
            Teléfono/WhatsApp: <a href="https://wa.me/573174666361" className="text-purple-300 underline hover:text-purple-100 transition-colors">+57 317 466 6361</a>
          </p>
          <p>
            Ubicación: Tolima-Ibagué, Colombia
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex justify-end">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-900/40 border-4 border-purple-700/30 min-h-[220px] min-w-[220px] flex items-center justify-center">
          <span className="text-gray-500 text-lg">Plantilla de imagen :3</span>
        </div>
      </div>
    </div>
  </section>
);

export default ContactsSection;