import React from "react";
import { Link } from "react-router-dom";
import logoComplete from "../../../public/img/logoCompleteWhite.svg";
import LogoTransparente from "../../assets/LogoTransparente.png";
import Footer from "../../components/home/footer";
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
      <header className="w-full flex justify-between items-center py-6 px-4 md:px-16 lg:px-20 bg-black/60 backdrop-blur-sm text-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <img src={LogoTransparente} alt="Logo Atlas" className="h-10 w-auto" />
            <img src={logoComplete} alt="Atlas Soft" className="h-8 w-auto hidden md:block" />
        </div>
        <div>
          <Link to="/" className="text-white hover:text-purple-300 transition-colors text-lg font-bold">
            Volver a Inicio
          </Link>
        </div>
      </header>

      <AboutUsSection />
      <MissionVisionSection />
      <CorporateValuesSection />
      <ServicesSection />
      <ContactsSection />
      <Footer />
    </div>
  </div>
);

export default LegalPage;