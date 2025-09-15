import React from "react";
import Navbar from "../../components/home/navbar";  
import AboutUsSection from "../../components/legal/AboutUsSection";
import MissionVisionSection from "../../components/legal/MissionVisionSection";
import CorporateValuesSection from "../../components/legal/CorporateValuesSection";
import ServicesSection from "../../components/legal/ServicesSection";
import ContactsSection from "../../components/legal/ContactsSection";

const AboutUsPage = () => (
    <div className="bg-black text-white relative overflow-hidden">
    {/* Fondo general que se desplaza y pulsa suavemente */}
    <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[50rem] h-[50rem] rounded-full bg-purple-900/30 blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full bg-fuchsia-800/30 blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse-slow delay-1000"></div>
    </div>
    
    <div className="relative z-10">
        <Navbar /> 
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

export default AboutUsPage;