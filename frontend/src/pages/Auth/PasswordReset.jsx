import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import FormContainer from "../../components/common/FormContainer";
import PasswordValidator from "../../components/functionalities/passwordValidation";
import { showLoadingToast, showSuccessToast, showErrorToast } from "../../components/common/popUp/Loading";
import toast from "react-hot-toast";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PasswordReset = () => {
  const { token } = useParams();
  const query = useQuery();
  const email = query.get("email");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const navigate = useNavigate();

  const PasswordValid = PasswordValidator({ password: formData.newPassword, onlyReturnValid: true });
  const ConfirmValid = formData.confirmPassword === formData.newPassword;

  const isButtonDisabled = () =>
    !formData.newPassword ||
    !formData.confirmPassword ||
    !PasswordValid ||
    !ConfirmValid ||
    isSubmitDisabled;

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
      const response = await fetch("http://127.0.0.1:8000/tasks/api/v1/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          new_password: formData.newPassword,
          token: token,
          email: email,
        }),
      });
      const data = await response.json();
      toast.dismiss(toastId);

      if (data.success) {
        showSuccessToast("Contraseña cambiada exitosamente");
        setTimeout(() => {
          navigate("/iniciar-sesion");
        }, 1800);
      } else {
        showErrorToast(data.message || "No se pudo cambiar la contraseña");
        setApiError(data.message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      showErrorToast("Error al restablecer la contraseña. Intenta nuevamente.");
      setApiError("Error al restablecer la contraseña. Intenta nuevamente.");
    }
    setIsSubmitDisabled(false);
  };

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