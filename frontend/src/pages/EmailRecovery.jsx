import React from "react";
import { Link } from "react-router-dom";

const EmailRecovery = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Hola Luis Núñez,</h2>
        <p className="text-gray-700 mb-4">
          Puedes restablecer tu contraseña haciendo clic en el botón que aparece
          a continuación.
        </p>
        <p className="text-gray-700 mb-6">
          Si no solicitaste el restablecimiento de tu contraseña, ignora este
          correo electrónico.
        </p>
        <Link
          to="/password-reset"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full text-center hover:bg-purple-700 block"
        >
          Restablecer contraseña
        </Link>
      </div>
    </div>
  );
};

export default EmailRecovery;