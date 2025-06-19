import React from 'react';
import logo from "../../assets/LogoTransparente.png";

const FormContainer = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white relative">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 80%, rgba(107, 70, 193, 0.3), rgba(0, 0, 0, 0.9) 90%)",
        }}
      ></div>
      <div className="relative z-10 bg-[#1E1B2E] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo de la empresa" className="h-16 w-auto" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;