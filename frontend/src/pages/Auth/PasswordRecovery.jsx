import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import FormContainer from "../../components/common/FormContainer";
import toast from "react-hot-toast";
import {
  showLoadingToast,
  showSuccessToast,
  showErrorToast,
} from "../../components/common/popUp/Loading";
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
      console.log("Enviando email para verificación:", email);

      const response = await fetch(
        "http://localhost:8000/tasks/api/v1/verificar-correo/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();


      if (!response.ok || !data.exists) {
        toast.dismiss(toastId);
        const errorMessage =
          data.message || data.error || "Correo no encontrado";
        console.error("Error del backend:", errorMessage);
        showErrorToast(errorMessage);
        return;
      }

      // Validación adicional para Supabase
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        toast.dismiss(toastId);
        showErrorToast("Por favor, introduce un correo electrónico válido");
        setMessage("Por favor, introduce un correo electrónico válido");
        return;
      }

      console.log("Verificando estado del usuario en Supabase...");

      const {
        data: { users },
        error: adminError,
      } = await client.auth.admin.listUsers();

      if (adminError) {
        console.error("Error al verificar usuario:", adminError);
      } else {
        const user = users.find((u) => u.email === email);
        console.log("Usuario encontrado en Supabase:", user);
        console.log("Email confirmado:", user?.email_confirmed_at);

        // Verificar si el email está confirmado
        if (user && !user.email_confirmed_at) {
          toast.dismiss(toastId);
          showErrorToast(
            "Debes confirmar tu email antes de restablecer la contraseña. Revisa tu bandeja de entrada."
          );
          setMessage(
            "Debes confirmar tu email antes de restablecer la contraseña."
          );
          return;
        }
      }

      const { data: supaData, error } = await client.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: window.location.origin + "/reset-password",
        }
      );

      toast.dismiss(toastId);

      if (error) {
        console.error("Error de Supabase:", error);

        if (error.message?.includes("invalid")) {
          showErrorToast(
            "Error técnico al enviar el correo. El usuario existe pero hay un problema de configuración."
          );
          setMessage("Error técnico al enviar el correo. Contacta al soporte.");
        } else {
          showErrorToast(
            "Error al enviar el correo. Intenta con otro correo electrónico."
          );
          setMessage(
            "Error al enviar el correo. Intenta con otro correo electrónico."
          );
        }
      } else {
        showSuccessToast("¡Enlace enviado! Revisa tu correo electrónico.");
        setStep(3);
      }
    } catch (error) {
      console.error("Error completo:", error);
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
              onChange={(e) => setEmail(e.target.value)}
              icon="bi-envelope-fill"
              placeholder="Ingresa tu correo"
              containerClassName="mb-0"
              required
            />
            {message && (
              <p className="text-red-500 text-sm mt-1 mb-0">{message}</p>
            )}
            <Button type="submit" className="w-full mt-4">
              Enviar enlace
            </Button>
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
              onChange={(e) => setEmail(e.target.value)}
              icon="bi-envelope-fill"
              placeholder="Ingresa tu correo"
              containerClassName="mb-0"
              required
            />
            {message && (
              <p className="text-red-500 text-sm mt-1 mb-0">{message}</p>
            )}
            <Button type="submit" className="w-full mt-4">
              Reenviar enlace
            </Button>
          </form>
        </>
      )}
    </FormContainer>
  );
};

export default PasswordRecovery;
