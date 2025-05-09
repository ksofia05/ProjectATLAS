import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
import PasswordValidator from "../components/componentsFunctionalities/passwordValidation";

const PasswordReset = () => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Controla la ventana emergente
  const [error,setError]= useState("");
  const [formData,setFormData]=useState({
    newPassword:"",
    confirmPassword:"",
  });
  const handleNewPasswordChange =(e)=>{
    const newPassword =e.target.value;
    setFormData({...formData,newPassword});
    if(formData.confirmPassword && formData.confirmPassword !== newPassword){
      setError("Las contraseñas no coinciden")
    } else{
      setError("");
    }
  };
  const handleConfirmPasswordChange=(e)=>{
    const confirmPassword= e.target.value;
    setFormData({...formData,confirmPassword});
    if(formData.newPassword && confirmPassword !==formData.newPassword){
      setError("Las contraseñas no coinciden")
    }else{
      setError("");
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessMessage(true); // Muestra la ventana flotante
    if(formData.newPassword!==formData.confirmPassword){
      setError("Las contraseñas no coinciden");
      return;
    };
    setError("");
    setShowSuccessMessage(true);
  };
  const closeMessage = () => {
    setShowSuccessMessage(false); // Cierra la ventana flotante
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
              {error &&(
                <p className="text-red-500 text-mb mb-4">{error}</p>
              )}
            <Button type="submit">Crear contraseña</Button>
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