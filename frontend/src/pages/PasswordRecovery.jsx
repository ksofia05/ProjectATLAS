import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";

const PasswordRecovery = () => {
  const [step, setStep] = useState(1); // Aqui inicia la primera vista de recuperar la contraseña
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2); // Este es el segundo paso, donde se muestra el mensaje de que el correo ha sido enviado
  };

  const closeMessage = () => {
    setStep(3); // Este es el tercer paso, y cierra la ventana flotando, pero aun hay errores
  };

  return (
    <FormContainer>
      {step === 1 && (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">
            ¿Olvidó su contraseña?
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon="📧"
            />
            <Button type="submit">Enviar enlace</Button>
          </form>
        </>
      )}

      {step === 2 && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center relative">
          <button
            onClick={closeMessage}
            className="absolute top-2 right-2 text-purple-500 hover:text-purple-700"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-4">El correo ha sido enviado!</h2>
          <p className="text-gray-400">
            No ves el correo? Dale un vistazo a tu carpeta de spam, a veces se
            esconde por ahí.
          </p>
          <div className="mt-4">
            <span className="text-purple-500 text-4xl">✈️</span>
          </div>
          <div className="mt-6">
            <Link
              to="/email-recuperacion"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Simulacion de correo
            </Link>
          </div>
        </div>
      )}

      {step === 3 && ( //Correcciones por hacer
        <>
          <h1 className="text-2xl font-bold text-center mb-4">
            ¿Todavía no ves el enlace en tu bandeja?
          </h1>
          <p className="text-gray-400 text-center mb-6">
            ¿Seguro que escribiste bien tu correo? Si todo está en orden,
            reenvía el enlace.
          </p>
          <form>
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon="📧"
            />
            <Link
              to="/email-recuperacion"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 block text-center"
            >
              Reenviar enlace
            </Link>
          </form>
        </>
      )}
    </FormContainer>
  );
};

export default PasswordRecovery;