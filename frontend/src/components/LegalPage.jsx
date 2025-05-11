import React from "react";

const LegalPage = ({ title, content }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white relative">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 80%, rgba(107, 70, 193, 0.3), rgba(0, 0, 0, 0.9) 90%)",
        }}
      ></div>
      <div className="relative z-10 bg-[#1E1B2E] p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
        <div className="text-gray-300 space-y-4">{content}</div>
        <div className="mt-6 text-center">
          <a
            href="/registrarse"
            className="text-purple-500 hover:underline"
          >
            Regresar
          </a>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;