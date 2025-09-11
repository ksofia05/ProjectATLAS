import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import FormContainer from "../../components/common/FormContainer";
import PasswordValidator from "../../components/functionalities/passwordValidation";
import { showLoadingToast, showSuccessToast, showErrorToast } from "../../components/common/popUp/Loading";
import toast from "react-hot-toast";
import { client } from "../../supabase/client"; // ← IMPORTACIÓN FALTANTE

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ← NUEVO ESTADO
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const params = new URLSearchParams(location.search);
  const next = params.get("next");
  const idProyecto = params.get("id_proyecto");

  const PasswordValid = PasswordValidator({ password: formData.newPassword, onlyReturnValid: true });
  const ConfirmValid = formData.confirmPassword === formData.newPassword;

  useEffect(() => {
    const verifySession = async () => {
      try {
        // DEBUGGING: Mostrar toda la URL actual
        console.log('Current URL:', window.location.href);
        console.log('Location hash:', location.hash);
        console.log('Location search:', location.search);
        
        // Verificar si hay un token de reset en la URL (puede venir como hash fragment O como query params)
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const queryParams = new URLSearchParams(location.search);
        
        // Intentar obtener tokens del hash primero, luego de query params
        let accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        let refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        let type = hashParams.get('type') || queryParams.get('type');
        
        console.log('Hash params:', { 
          accessToken: accessToken ? 'present' : 'missing', 
          refreshToken: refreshToken ? 'present' : 'missing', 
          type 
        });

        if (type === 'recovery' && accessToken && refreshToken) {
          console.log('Found recovery tokens, setting session...');
          // Establecer la sesión con los tokens del reset
          const { data, error } = await client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Error setting session:', error);
            showErrorToast("Enlace de recuperación inválido o expirado");
            const  redirectParams = new URLSearchParams();
            if (next) redirectParams.set("next", next);
            if (idProyecto) redirectParams.set("id_proyecto", idProyecto);
            const redirectUrl = `/recuperar-contrasena${redirectParams.toString() ? `?${redirectParams.toString()}` : ''}`;
            navigate(redirectUrl);
          } else {
            console.log('Session set successfully:', data);
            setIsValidSession(true);
          }
        } else {
          console.log('No recovery tokens found, checking existing session...');
          // Si no hay tokens de recovery, verificar si ya hay una sesión activa
          const { data: { session }, error } = await client.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            showErrorToast("Error al verificar la sesión");
            const redirectParams =  new URLSearchParams();
            if (next) redirectParams.set("next", next);
            if (idProyecto) redirectParams.set("id_proyecto", idProyecto);
            const redirectUrl = `/recuperar-contrasena${redirectParams.toString() ? `?${redirectParams.toString()}` : ''}`;
            navigate(redirectUrl);
          } else if (!session) {
            console.log('No active session found');
            console.log('Available URL params:', {
              hash: location.hash,
              search: location.search,
              pathname: location.pathname
            });
            showErrorToast("Enlace de recuperación inválido o expirado");
            const redirectParams = new URLSearchParams();
            if (next) redirectParams.set("next", next);
            if (idProyecto) redirectParams.set("id_proyecto", idProyecto);
            const redirectUrl = `/recuperar-contrasena${redirectParams.toString() ? `?${redirectParams.toString()}` : ''}`;
            navigate(redirectUrl);
          } else {
            console.log('Active session found:', session);
            setIsValidSession(true);
          }
        }
      } catch (error) {
        console.error('Error in session verification:', error);
        showErrorToast("Error al verificar el enlace de recuperación");
        const redirectParams = new URLSearchParams();
        if (next) redirectParams.set("next", next);
        if (idProyecto) redirectParams.set("id_proyecto", idProyecto);
        const redirectUrl = `/recuperar-contrasena${redirectParams.toString() ? `?${redirectParams.toString()}` : ''}`;
        navigate(redirectUrl);
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
        password: formData.newPassword
      });

      toast.dismiss(toastId);

      if (error) {
        console.error('Error updating password:', error); // ← DEBUG
        showErrorToast(error.message || "No se pudo cambiar la contraseña");
        setApiError(error.message);
      } else {
        console.log('Password updated successfully:', data); // ← DEBUG
        showSuccessToast("Contraseña cambiada exitosamente");
        // Cerrar sesión después de cambiar la contraseña
        await client.auth.signOut();
        await new Promise(resolve => setTimeout(resolve, 500)); // Esperar medio segundo para asegurar que la sesión se cierre
        localStorage.setItem("fromPasswordReset", "1");

        let loginURL = `/iniciar-sesion`;
        if (next || idProyecto){
          const loginParams = new URLSearchParams();
          if (next) loginParams.set("next", next);
          if (idProyecto) loginParams.set("id_proyecto", idProyecto);
          loginURL += `?${loginParams.toString()}`;
        }
        navigate(loginURL, { replace: true });
        };
      }
    catch (error) {
      console.error('Error in password update:', error); // ← DEBUG
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
          <h1 className="text-2xl font-bold mb-4">Verificando enlace...</h1>
          <p className="text-gray-400">Por favor espera mientras verificamos tu enlace de recuperación.</p>
        </div>
      </FormContainer>
    );
  }

  // Si la sesión no es válida, no mostrar el formulario
  if (!isValidSession) {
    return (
      <FormContainer>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Enlace inválido</h1>
          <p className="text-gray-400">El enlace de recuperación ha expirado o no es válido.</p>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <h1 className="text-2xl font-bold text-center mb-4">
        Crea una nueva contraseña
      </h1>
      <p className="text-gray-400 text-center mb-6">
        Su nueva contraseña debe ser diferente de la utilizada anteriormente
        y debe cumplir con los requisitos.
      </p>
      <form onSubmit={handleSubmit}>
        <PasswordInput
          label="Nueva Contraseña"
          type="password"
          name="newPassword"
          icon="bi-eye-fill"
          value={formData.newPassword}
          onChange={handleNewPasswordChange}
        />
        <PasswordValidator password={formData.newPassword} />
        <PasswordInput
          label="Confirmar Contraseña"
          type="password"
          name="confirmPassword"
          icon="bi-eye-fill"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1 mb-0">{error}</p>
        )}
        {apiError && (
          <p className="text-red-500 text-sm mt-1 mb-0">{apiError}</p>
        )}
        <Button
          type="submit"
          disabled={isButtonDisabled()}
          className={`w-full mt-6 ${isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Crear contraseña
        </Button>
      </form>
    </FormContainer>
  );
};

export default PasswordReset;