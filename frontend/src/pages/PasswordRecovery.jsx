import React, { useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";

const PasswordRecovery = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate =useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/tasks/api/v1/recuperacionContrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (data.success) {
        setStep(2);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error al enviar solicitud. Intenta nuevamente.");
    }
  };

  const closeMessage = () => setStep(3);

      
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
          {message && (
            <p className="text-red-500 text -center mb-4">{message}</p>
          )}
          <form onSubmit={handleSubmit}>
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={email}
              onChange={e=> setEmail(e.target.value)}
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
          {message && (
            <p className="text-red-500 text -center mb-4">{message}</p>
          )}
          <form onSubmit={handleSubmit}>
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon="📧"
            />
             <Button type="submit">Enviar enlace</Button>
          </form>
        </>
      )}
    </FormContainer>
  );
};

export default PasswordRecovery;