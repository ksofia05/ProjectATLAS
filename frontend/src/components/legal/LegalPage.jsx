import React from "react";
import Navbar from "../home/navbar";  // Importar correctamente como componente
import AboutUsSection from "./AboutUsSection";
import MissionVisionSection from "./MissionVisionSection";
import CorporateValuesSection from "./CorporateValuesSection";
import ServicesSection from "./ServicesSection";
import ContactsSection from "./ContactsSection";

const LegalPage = () => (
  <div className="bg-black text-white relative overflow-hidden">
    {/* Fondo general que se desplaza y pulsa suavemente */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/4 w-[50rem] h-[50rem] rounded-full bg-purple-900/30 blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full bg-fuchsia-800/30 blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse-slow delay-1000"></div>
    </div>
    
    <div className="relative z-10">
      <Navbar />  {/* Usar como componente React con mayúscula */}
      <div>
        <AboutUsSection />
        <MissionVisionSection />
        <CorporateValuesSection />
        <ServicesSection />
        <ContactsSection />
      </div>
    </div>
  </div>
);

export default LegalPage;