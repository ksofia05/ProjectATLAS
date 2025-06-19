import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import FormContainer from "../../components/common/FormContainer";
import toast from 'react-hot-toast';
import { showLoadingToast, showSuccessToast, showErrorToast } from "../../components/common/popUp/Loading";
import { client } from "../../supabase/client"; 

const PasswordRecovery = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const toastId = showLoadingToast("Enviando enlace...");
    
    try {
      // Intenta con diferentes configuraciones de redirectTo
      const { data, error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      toast.dismiss(toastId);

      if (error) {
        console.error('Reset password error:', error);
        showErrorToast(error.message || "No se pudo enviar el correo");
        setMessage(error.message);
      } else {
        console.log('Reset password success:', data);
        showSuccessToast("¡Enlace enviado! Revisa tu correo electrónico.");
        setStep(3);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.dismiss(toastId);
      showErrorToast("Error al enviar solicitud. Intenta nuevamente.");
      setMessage("Error al enviar solicitud. Intenta nuevamente.");
    }
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
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon="bi-envelope-fill"
              containerClassName="mb-0"
              required
            />
            {message && (
              <p className="text-red-500 text-sm mt-1 mb-0">{message}</p>
            )}
            <Button type="submit" className="w-full mt-4">Enviar enlace</Button>
          </form>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">
            ¿Todavía no ves el enlace en tu bandeja?
          </h1>
          <p className="text-gray-400 text-center mb-6">
            ¿Seguro que escribiste bien tu correo? Si todo está en orden,
            reenvía el enlace.
          </p>
          
          <form onSubmit={handleSubmit}>
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon="bi-envelope-fill"
              containerClassName="mb-0"
              required
            />
            {message && (
              <p className="text-red-500 text-sm mt-1 mb-0">{message}</p>
            )}
            <Button type="submit" className="w-full mt-4">Reenviar enlace</Button>
          </form>
        </>
      )}
    </FormContainer>
  );
};

export default PasswordRecovery;