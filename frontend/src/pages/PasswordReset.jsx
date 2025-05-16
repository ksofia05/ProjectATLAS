import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
import PasswordValidator from "../components/componentsFunctionalities/passwordValidation";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const PasswordReset = () => {
  const { token } = useParams();
  const query = useQuery();
  const email = query.get("email");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const isButtonDisabled=()=>{
    return(
      !formData.newPassword ||
      !formData.confirmPassword ||
      !PasswordValid ||
      !ConfirmValid ||
      isSubmitDisabled);
  };
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  // Si PasswordValidator no retorna booleano, reemplaza esta línea por tu propia validación
  const PasswordValid = PasswordValidator({ password: formData.newPassword, onlyReturnValid: true });
  const ConfirmValid = formData.confirmPassword === formData.newPassword;

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
    try {
      const response = await fetch("http://127.0.0.1:8000/tasks/api/v1/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          new_password: formData.newPassword, // <-- aquí el cambio
          token: token,
          email:email,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowSuccessMessage(true);
      } else {
        setApiError(data.message);
      }
    } catch (error) {
      setApiError("Error al restablecer la contraseña. Intenta nuevamente.");
    }
    setIsSubmitDisabled(false);
  };

  const closeMessage = () => {
    setShowSuccessMessage(false);
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
              value={formData.newPassword}
              onChange={handleNewPasswordChange}
            />
            <PasswordValidator password={formData.newPassword} />
            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              icon="👁️"
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {error && (
              <p className="text-red-500 text-mb mb-4">{error}</p>
            )}
            {apiError && (
              <p className="text-red-500 text-mb mb-4">{apiError}</p>
            )}
            <Button
              type="submit"
              disabled={isButtonDisabled()}
              className={`${
                isButtonDisabled()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              
            >
              Crear contraseña
            </Button>
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
          <h2 className="text-xl font-bold mb-4">¡Contraseña creada exitosamente!</h2>
          <p className="text-gray-400">
            Tu contraseña ha sido restablecida correctamente. Inicia sesión para continuar.
          </p>
          <div className="mt-6">
            <Button>
              <Link to="/iniciar-sesion" className="text-white">
                Iniciar sesión
              </Link>
            </Button>
          </div>
        </div>
      )}
    </FormContainer>
  );
};

export default PasswordReset;