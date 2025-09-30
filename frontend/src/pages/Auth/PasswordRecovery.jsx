import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import API_BASE_URL from "../../api/apiBase";
const PasswordRecovery = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const next = params.get("next");
  const idProyecto = params.get("id_proyecto");

  const isEmailValid = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = showLoadingToast("Verificando correo...");

    try {
      const response = await fetch(
        `${API_BASE_URL}/tasks/api/v1/verificar-correo/`,
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
        showErrorToast(errorMessage);
        return;
      }

      // Validación adicional para Supabase
      if (!isEmailValid()) {
        toast.dismiss(toastId);
        showErrorToast("Por favor, introduce un correo electrónico válido.");
        setMessage("Por favor, introduce un correo electrónico válido");
        return;
      }

      const {
        data: { users },
        error: adminError,
      } = await client.auth.admin.listUsers();

      if (!adminError) {
        const user = users.find((u) => u.email === email);

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

      let redirectTo = window.location.origin + "/reset-password";
      if (next || idProyecto) {
        const redirectParams = new URLSearchParams();
        if (next) redirectParams.set("next", next);
        if (idProyecto) redirectParams.set("id_proyecto", idProyecto);
        redirectTo += `?${redirectParams.toString()}`;
      }

      const { data: supaData, error } = await client.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: redirectTo,
        }
      );

      toast.dismiss(toastId);

      if (error) {
        if (error.message?.includes("invalid")) {
          showErrorToast(
            "Error técnico al enviar el correo. El usuario existe pero hay un problema de configuración."
          );
          setMessage("Error técnico al enviar el correo. Contacta al soporte.");
        } else {
          showErrorToast(
            "Por favor, espera 1 minuto para volver a reenviar una solicitud."
          );
        }
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
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            ¿Olvidó su contraseña?
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </p>
          <form
            onSubmit={handleSubmit}
            className="border border-slate-800/40 rounded-3xl shadow-lg p-8 w-full hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-md"
          >
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="bi-envelope-fill"
              placeholder="Ingresa tu correo"
              className="w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200 pr-12"
              labelClassName="text-gray-300 font-medium mb-2"
              errorClassName="text-red-400 text-sm mt-1"
              required
            />
            {message && (
              <p className="text-red-500 text-sm mt-1 mb-0">{message}</p>
            )}
            <Button
              type="submit"
              disabled={!isEmailValid() || !email}
              className={`w-full mt-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold py-3 rounded-xl shadow-md hover:from-purple-600 hover:to-purple-400 transition-all duration-200 ${
                !isEmailValid() || !email ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Enviar enlace
            </Button>
          </form>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            ¿Todavía no ves el enlace en tu bandeja?
          </h1>
          <p className="text-gray-400 text-center mb-8">
            ¿Seguro que escribiste bien tu correo? Si todo está en orden,
            reenvía el enlace.
          </p>
          <form
            onSubmit={handleSubmit}
            className="border border-slate-800/40 rounded-3xl shadow-lg p-8 w-full hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-md"
          >
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="bi-envelope-fill"
              placeholder="Ingresa tu correo"
              className="w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200 pr-12"
              labelClassName="text-gray-300 font-medium mb-2"
              errorClassName="text-red-400 text-sm mt-1"
              required
            />
            {message && (
              <p className="text-red-500 text-sm mt-1 mb-0">{message}</p>
            )}
            <Button
              type="submit"
              disabled={!isEmailValid() || !email}
              className={`w-full mt-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold py-3 rounded-xl shadow-md hover:from-purple-600 hover:to-purple-400 transition-all duration-200 ${
                !isEmailValid() || !email ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Reenviar enlace
            </Button>
          </form>
        </>
      )}
    </FormContainer>
  );
};

export default PasswordRecovery;
