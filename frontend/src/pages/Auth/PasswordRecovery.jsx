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
    const toastId = showLoadingToast("Verificando correo...");

    try {
      // Aqui estamos verificando si el correo esta en la bd
      const response = await fetch("http://localhost:8000/tasks/api/v1/verificar-correo/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok || !data.exists) {
        toast.dismiss(toastId);
        showErrorToast("Correo no encontrado");
        return;
      }

      // 2. Si existe, procede con Supabase
      const { data: supaData, error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      toast.dismiss(toastId);

      if (error) {
        showErrorToast(error.message || "No se pudo enviar el correo");
        setMessage(error.message);
      } else {
        showSuccessToast("¡Enlace enviado! Revisa tu correo electrónico.");
        setStep(3);
      }
    } catch (error) {
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