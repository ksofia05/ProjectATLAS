import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import PasswordInput from "../../components/common/PasswordInput";
import {
  showLoadingToast,
  showSuccessToast,
  showErrorToast,
} from "../../components/common/popUp/Loading";
import toast from "react-hot-toast";
import { client } from "../../supabase/client";
import useUserStore from "../../stores/useUserStore";
import { login } from "../../services/authService";
import { getUserProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthProvider";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, recheckAuth } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/dashboard-create-project";
  const idProyecto = params.get("id_proyecto");

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('Usuario autenticado detectado, redirigiendo...');
      setTimeout(() => {
        navigate(next);
      }, 100);
    }
  }, [isAuthenticated, isLoading, navigate, next]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoggingIn(true);
    const toastId = showLoadingToast("Ingresando...");

    try {
      const { data, error } = await login(formData.email, formData.password);
      toast.dismiss(toastId);

      if (error) {
        let errorMessage = "Error al iniciar sesión";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciales inválidas. Verifica tu correo y contraseña.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Por favor confirma tu correo electrónico antes de iniciar sesión.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Demasiados intentos. Intenta nuevamente en unos minutos.";
        }
        showErrorToast(errorMessage);
        setErrors((prev) => ({
          ...prev,
          password: errorMessage,
        }));
        return;
      }

      if (data.user && data.session) {
        console.log('✅ Login exitoso, token guardado, esperando AuthProvider...');
        
        // Guardar token para compatibilidad
        localStorage.setItem("token", data.session.access_token);
        
        // MANTENER compatibilidad con useUserStore temporalmente
        try {
          const userProfile = await getUserProfile(data.user.id);
          
          const fullUserData = {
            auth_user_id: data.user.id,
            email: data.user.email,
            user_metadata: data.user.user_metadata,
            ...userProfile,
          };
          
          useUserStore.getState().setUser(fullUserData);
          console.log('Usuario guardado en store (compatibilidad):', fullUserData.nombre);
        } catch (profileError) {
          console.error('Error obteniendo perfil en login:', profileError);
          useUserStore.getState().setUser({
            auth_user_id: data.user.id,
            email: data.user.email,
            user_metadata: data.user.user_metadata,
          });
        }
        
        setErrors({});
        showSuccessToast("¡Ingreso exitoso!");
        
        // Lógica de asociación de colaborador
        if (idProyecto && formData.email) {
          try {
            await fetch("http://localhost:8000/tasks/api/v1/asociar_colaborador/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id_proyecto: idProyecto,
                email: formData.email,
              }),
            });
          } catch (err) {
            showErrorToast("Error al asociar colaborador al proyecto.");
          }
        }

        console.log('Login completado, forzando recheck del AuthProvider...');

        // FORZAR RECHECK 
        setTimeout(async () => {
          if (recheckAuth) {
            await recheckAuth();
            console.log('Recheck completado, AuthProvider debería estar actualizado');
          } else {
            console.error('recheckAuth no está disponible');
          }
        }, 1000);
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error de login:", error);
      showErrorToast("No se pudo conectar con el servidor.");
      setErrors((prev) => ({
        ...prev,
        password: "No se pudo conectar con el servidor.",
      }));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!value) {
        error = "El correo electrónico es requerido";
      } else if (!emailRegex.test(value)) {
        error = "Correo electrónico inválido";
      }
    }
    if (name === "password") {
      if (!value) {
        error = "La contraseña es requerida";
      } else if (value.length < 8) {
        error = "Contraseña no cumple con los requisitos";
      }
    }
    return error;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    const error = validateField(name, value);
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

  const isButtonDisabled = () => {
    return (
      !formData.email ||
      !formData.password ||
      Object.values(errors).some((err) => err) ||
      isLoggingIn
    );
  };

  return (
    <FormContainer>
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        Iniciar sesión
      </h1>
      <p className="text-gray-400 text-center mb-8">Bienvenido de nuevo</p>
      <form onSubmit={handleSubmit}>
        <Input
          label="Correo Electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          errorMessage={errors.email}
          icon="bi-envelope-fill"
          placeholder="Ingresa tu correo"
        />
        <PasswordInput
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          errorMessage={errors.password}
          icon="bi-eye-fill"
          placeholder="Ingresa tu contraseña"
        />
        <Button
          type="submit"
          disabled={isButtonDisabled()}
          loading={isLoggingIn}
          loadingText="Ingresando..."
          className={`w-full mt-4 ${
            isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Ingresar
        </Button>
      </form>
      <div className="text-center mt-6">
        <p className="text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link to="/registrarse" className="text-purple-400 hover:underline">
            Regístrate
          </Link>
        </p>
        <p className="text-gray-400 mt-2">
          ¿Olvidaste tu contraseña?{" "}
          <Link
            to={`/recuperar-contrasena${next || idProyecto ? `?${params.toString()}` : ""}`}
            className="text-purple-400 hover:underline"
          >
            Recuperar contraseña
          </Link>
        </p>
      </div>
    </FormContainer>
  );
};

export default Login;
