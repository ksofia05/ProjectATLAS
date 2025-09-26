import React from "react";
import logo from "../../assets/LogoTransparente.png";

const FormContainer = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #08080e 60%, #0c0c14 100%), radial-gradient(circle at 50% 80%, rgba(107,70,193,0.18) 0%, rgba(0,0,0,0.92) 80%)",
        }}
      ></div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-700 opacity-20 blur-3xl rounded-full"></div>
      </div>
      <div
        className="relative z-10 
        bg-gradient-to-br from-[#181825]/95 to-[#14141e]/95 via-[#181825]/95
        backdrop-blur-lg 
        border border-slate-700/40 
        rounded-3xl 
        shadow-lg 
        w-full max-w-[480px] mx-4 sm:mx-0 
        p-4 sm:p-6 md:p-8
        hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300
      "
      >
        <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
          <img
            src={logo}
            alt="Logo de la empresa"
            className="h-12 sm:h-14 md:h-16 w-auto"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
