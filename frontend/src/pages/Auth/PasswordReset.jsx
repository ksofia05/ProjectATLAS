import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Eliminado useParams
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import FormContainer from "../../components/common/FormContainer";
import PasswordValidator from "../../components/functionalities/passwordValidation";
import {
  showLoadingToast,
  showSuccessToast,
  showErrorToast,
} from "../../components/common/popUp/Loading";
import toast from "react-hot-toast";
import { client } from "../../supabase/client";

const PasswordReset = () => {
  // const { token } = useParams(); // Eliminado, no se usa
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const params = new URLSearchParams(location.search);
  const next = params.get("next");
  const idProyecto = params.get("id_proyecto");

  const PasswordValid = PasswordValidator({
    password: formData.newPassword,
    onlyReturnValid: true,
  });
  const ConfirmValid = formData.confirmPassword === formData.newPassword;

  useEffect(() => {
    if (location.state?.recoveryError) {
      setIsLoading(false);
      setIsValidSession(false);
      return;
    }

    const verifySession = async () => {
      try {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const queryParams = new URLSearchParams(location.search);

        let accessToken =
          hashParams.get("access_token") || queryParams.get("access_token");
        let refreshToken =
          hashParams.get("refresh_token") || queryParams.get("refresh_token");
        let type = hashParams.get("type") || queryParams.get("type");

        if (type === "recovery" && accessToken && refreshToken) {
          const { data, error } = await client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            if (!location.state?.recoveryError) {
              showErrorToast("Enlace de recuperación inválido o expirado");
            }
            const redirectParams = new URLSearchParams();
            if (next) redirectParams.set("next", next);
            if (idProyecto) redirectParams.set("id_proyecto", idProyecto);
            const redirectUrl = `/recuperar-contrasena${
              redirectParams.toString() ? `?${redirectParams.toString()}` : ""
            }`;
            navigate(redirectUrl, { state: { recoveryError: true } });
          } else {
            setIsValidSession(true);
          }
        } else {
          const {
            data: { session },
            error,
          } = await client.auth.getSession();

          if (error) {
            showErrorToast("Error al verificar la sesión");
            const redirectParams = new URLSearchParams();
            if (next) redirectParams.set("next", next);
            if (idProyecto) redirectParams.set("id_proyecto", idProyecto);
            const redirectUrl = `/recuperar-contrasena${
              redirectParams.toString() ? `?${redirectParams.toString()}` : ""
            }`;
            navigate(redirectUrl, { state: { recoveryError: true } });
          } else if (!session) {
            showErrorToast("Enlace de recuperación inválido o expirado");
            const redirectParams = new URLSearchParams();
            if (next) redirectParams.set("next", next);
            if (idProyecto) redirectParams.set("id_proyecto", idProyecto);
            const redirectUrl = `/recuperar-contrasena${
              redirectParams.toString() ? `?${redirectParams.toString()}` : ""
            }`;
            navigate(redirectUrl, { state: { recoveryError: true } });
          } else {
            setIsValidSession(true);
          }
        }
      } catch (error) {
        showErrorToast("Error al verificar el enlace de recuperación");
        const redirectParams = new URLSearchParams();
        if (next) redirectParams.set("next", next);
        if (idProyecto) redirectParams.set("id_proyecto", idProyecto);
        const redirectUrl = `/recuperar-contrasena${
          redirectParams.toString() ? `?${redirectParams.toString()}` : ""
        }`;
        navigate(redirectUrl, { state: { recoveryError: true } });
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [location, navigate]);

  const isButtonDisabled = () =>
    !formData.newPassword ||
    !formData.confirmPassword ||
    !PasswordValid ||
    !ConfirmValid ||
    isSubmitDisabled ||
    !isValidSession;

  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, newPassword });
    if (formData.confirmPassword && formData.confirmPassword !== newPassword) {
      setError("Las contraseñas no coinciden");
    } else {
      setError("");
    }
    setApiError("");
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });
    if (formData.newPassword && confirmPassword !== formData.newPassword) {
      setError("Las contraseñas no coinciden");
    } else {
      setError("");
    }
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setApiError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!PasswordValid) {
      setApiError("La contraseña no cumple con los requisitos");
      return;
    }

    setIsSubmitDisabled(true);
    const toastId = showLoadingToast("Cambiando contraseña...");

    try {
      const { data, error } = await client.auth.updateUser({
        password: formData.newPassword,
      });

      toast.dismiss(toastId);

      if (error) {
        let errorMsg = error.message;
        if (
          errorMsg &&
          errorMsg
            .toLowerCase()
            .includes("new password should be different from the old password")
        ) {
          errorMsg = "La nueva contraseña debe ser diferente a la anterior.";
        }
        showErrorToast(errorMsg || "No se pudo cambiar la contraseña");
        setApiError(errorMsg);
      } else {
        showSuccessToast("Contraseña cambiada exitosamente");
        await client.auth.signOut();
        await new Promise((resolve) => setTimeout(resolve, 500));
        localStorage.setItem("fromPasswordReset", "1");

        let loginURL = `/iniciar-sesion`;
        if (next || idProyecto) {
          const loginParams = new URLSearchParams();
          if (next) loginParams.set("next", next);
          if (idProyecto) loginParams.set("id_proyecto", idProyecto);
          loginURL += `?${loginParams.toString()}`;
        }
        navigate(loginURL, { replace: true });
      }
    } catch (error) {
      toast.dismiss(toastId); 
      showErrorToast("Error al restablecer la contraseña. Intenta nuevamente.");
      setApiError("Error al restablecer la contraseña. Intenta nuevamente.");
    }
    setIsSubmitDisabled(false);
  };

  // Pantalla de carga mientras se verifica la sesión
  if (isLoading) {
    return (
      <FormContainer>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">
            Verificando enlace...
          </h1>
          <p className="text-gray-400">
            Por favor espera mientras verificamos tu enlace de recuperación.
          </p>
        </div>
      </FormContainer>
    );
  }

  // Si la sesión no es válida, no mostrar el formulario
  if (!isValidSession) {
    return (
      <FormContainer>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">
            Enlace inválido
          </h1>
          <p className="text-gray-400">
            El enlace de recuperación ha expirado o no es válido.
          </p>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <h1 className="text-2xl font-bold text-center mb-4 text-white">
        Crea una nueva contraseña
      </h1>
      <p className="text-gray-400 text-center mb-5">
        Su nueva contraseña debe ser diferente de la utilizada anteriormente y
        debe cumplir con los requisitos.
      </p>
      <form
        onSubmit={handleSubmit}
        className="border border-slate-800/40 rounded-3xl shadow-lg p-6 w-full hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-md"
      >
        <PasswordInput
          label="Nueva Contraseña"
          type="password"
          name="newPassword"
          icon="bi-eye-fill"
          value={formData.newPassword}
          onChange={handleNewPasswordChange}
          className="w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200"
          containerClassName="mb-4"
          labelClassName="text-gray-300 font-medium mb-2"
          errorClassName="text-red-400 text-sm mt-1"
        />
        <div className="mb-3">
          <PasswordValidator password={formData.newPassword} />
        </div>
        <PasswordInput
          label="Confirmar Contraseña"
          type="password"
          name="confirmPassword"
          icon="bi-eye-fill"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange}
          className="w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200"
          containerClassName="mb-4"
          labelClassName="text-gray-300 font-medium mb-2"
          errorClassName="text-red-400 text-sm mt-1"
        />
        {error && <p className="text-red-500 text-sm mt-1 mb-0">{error}</p>}
        {apiError && (
          <p className="text-red-500 text-sm mt-1 mb-0">{apiError}</p>
        )}
        <Button
          type="submit"
          disabled={isButtonDisabled()}
          className={`w-full mt-3 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold py-3 rounded-xl shadow-md hover:from-purple-600 hover:to-purple-400 transition-all duration-200 ${
            isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Crear contraseña
        </Button>
      </form>
    </FormContainer>
  );
};

export default PasswordReset;
