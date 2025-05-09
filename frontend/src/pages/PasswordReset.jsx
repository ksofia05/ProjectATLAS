import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";

const PasswordReset = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Controla la ventana emergente

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessMessage(true); // Muestra la ventana flotante
  };

  const closeMessage = () => {
    setShowSuccessMessage(false); // Cierra la ventana flotante
  };

  return (
    <FormContainer>
      {!showSuccessMessage ? (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">
            Crea una nueva contraseña
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Su nueva contraseña debe ser diferente de la utilizada anteriormente
            y debe cumplir con los requisitos.
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              label="Nueva Contraseña"
              type="password"
              name="newPassword"
              icon="👁️"
            />
            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              icon="👁️"
            />
            <p className="text-sm text-gray-400 mb-4">
              <span className="text-purple-500">•</span> Al menos 8 caracteres{" "}
              <span className="text-purple-500">•</span> Al menos un número
            </p>
            <Button type="submit">Crear contraseña</Button>
          </form>
        </>
      ) : (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center relative">
          <button
            onClick={closeMessage}
            className="absolute top-2 right-2 text-purple-500 hover:text-purple-700"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-4">Contraseña creada exitosamente!</h2>
          <p className="text-gray-400">
            Tu contraseña ha sido restablecida correctamente. Inicia sesión para continuar.
          </p>
          <div className="mt-6">
            <Button>
              <a href="/iniciar-sesion" className="text-white">
                Iniciar sesión
              </a>
            </Button>
          </div>
        </div>
      )}
    </FormContainer>
  );
};

export default PasswordReset;