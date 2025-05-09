import React from "react";

const LegalPage = ({ title, content }) => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-3xl">
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