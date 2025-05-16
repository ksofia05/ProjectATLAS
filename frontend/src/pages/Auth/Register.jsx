import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormContainer from '../../components/common/FormContainer';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Checkbox from '../../components/common/Checkbox';
import Button from '../../components/common/Button';
import PasswordValidator from '../../components/functionalities/passwordValidation';
import { useRegisterFormPersistence, saveRegisterFormToStorage } from '../../hooks/useRegisterFormPersistence';
// import AnimatedContainer from '../components/AnimatedContainer';
import Error from '../../components/common/popUp/error';
import Exitoso from '../../components/common/popUp/Success';

console.log('Register component rendered')
const Register = () => {
  const navigate = useNavigate(); // Para redirección
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  useRegisterFormPersistence(setFormData, setStep);

    const [errors, setErrors] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  
    const validateField = (name, value) => {
      let error = "";
  
      if (name === "firstName") {
        if (!value) {
          error = "El nombre es requerido";
        } 
      } 
      if (name === "lastName") {
        if (!value) {
          error = "El apellido es requerido";
        } 
      }
      if (name === "email") {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!value) {
          error = "El correo electrónico es requerido";
        } else if (!emailRegex.test(value)) {
          error = "Correo electrónico inválido";
        }
      }
      return error;
    };
    const handleChange = ({ target: { name, value, type, checked } }) => {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });

      // Validar el campo en tiempo real
      const error = validateField(name, type === "checkbox" ? checked : value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    };
    const validateForm = () => {
      const newErrors = {};
      Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      });
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

useEffect(() => {
  const isFilled = formData.firstName && formData.lastName && formData.email;
  const firstNameError = validateField("firstName", formData.firstName);
  const lastNameError = validateField("lastName", formData.lastName);
  const emailError = validateField("email", formData.email);
  const hasLocalErrors = !!(firstNameError || lastNameError || emailError);
  const hasBackendEmailError = !!errors.email; // Verifica si hay un error en el email

  setIsSubmitDisabled(!(isFilled && !hasLocalErrors && !hasBackendEmailError));
}, [formData.firstName, formData.lastName, formData.email, errors]);
    
  // const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleNext = async () => {
  const emailError = validateField("email", formData.email);
  setErrors(prevErrors => ({ ...prevErrors, email: emailError }));

  if (!emailError && formData.firstName && formData.lastName && formData.email) {
    try {
      const response = await fetch("http://localhost:8000/tasks/api/v1/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checkEmailOnly: true, email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
      } else {
        setErrors(prevErrors => ({ ...prevErrors, email: data.error || 'Este correo ya está registrado.' }));
      }
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      Error("No se pudo verificar el correo.");
    }
  }
};
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.termsAccepted) {
      Error('Debes aceptar los términos y condiciones.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Error('Las contraseñas no coinciden.');
      return;
    }

  if (step === 2) {

    try {
      const response = await fetch("http://localhost:8000/tasks/api/v1/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData }), // Enviar todos los datos sin checkEmailOnly
      });

      const data = await response.json();

      if (response.ok) {
        Exitoso('creacion de cuenta exitosa');
        console.log("Usuario creado:", data.usuario);
        localStorage.removeItem('registerFormData'); // Limpia los datos guardados
        localStorage.removeItem('registerStep');
        navigate("/iniciar-sesion");
      } else {
        if (data?.error?.includes("correo ya está registrado")) {
          setErrors((prevErrors) => ({ ...prevErrors, email: data.error }));
          setStep(1); // Volver al primer paso para mostrar el error
        } else {
          Error(data.error || "Error al crear cuenta");
        }
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Error("No se pudo conectar con el servidor.");
    }
  }
};

  return (
    <FormContainer>
      {step === 1 ? (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">Registrar cuenta</h1>
          <p className="text-gray-400 text-center mb-6">
            ¿Ya estás registrado?{' '}
            <Link to="/iniciar-sesion" className="text-purple-500 hover:underline">
              Iniciar sesión
            </Link>
          </p>
          <Input
            label="Nombres"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            errorMessage={errors.firstName}
            
          />
          <Input
            label="Apellidos"
            type="text"
            name="lastName"
            value={formData.lastName}
            errorMessage={errors.lastName}
            onChange={handleChange}
            
          />
          <Input
            label="Correo"
            type="email"
            name="email"
            value={formData.email}
            errorMessage={errors.email}
            onChange={handleChange}
            
          />
          <Button
            onClick={handleNext}
            disabled={isSubmitDisabled}
            className={isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}
          >
            Siguiente
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">Registrar cuenta</h1>
          <p className="text-gray-400 text-center mb-6">¡Casi listo! Continúa con la creación de tu contraseña.</p>
          <PasswordInput
            label="Crear Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            
          />

            <PasswordValidator password={formData.password} />

            <PasswordInput
              label="Confirmar Contraseña"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              errorMessage={
                formData.confirmPassword && formData.confirmPassword !== formData.password
                  ? 'Las contraseñas no coinciden'
                  : ''
              }
            />

            <Checkbox
              label={
                <>
                  Acepto los{' '}
                  <Link 
                    to="/terminos" 
                    state={{ from: "/registrarse" }}
                    className="text-purple-500 hover:underline"
                    onClick={() => saveRegisterFormToStorage(formData, step)}
                  >Términos de Servicio
                  </Link>{' '}

                  y{' '}
                  <Link 
                    to="/politica-de-privacidad" 
                    state={{ from: "/registrarse" }}
                    className="text-purple-500 hover:underline"
                    onClick={() => saveRegisterFormToStorage(formData, step)}
                  >Políticas de Privacidad
                  </Link>
                </>
              }
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <div className="flex justify-between space-x-8">
              <Button onClick={handleBack}>Atrás</Button>
              <Button onClick={handleSubmit} type="submit">
                Registrar
              </Button>
            </div>
          </>
        )}
      </FormContainer>
  );
};

export default Register;