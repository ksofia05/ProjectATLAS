import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import PasswordInput from "../../components/common/PasswordInput";
import { showLoadingToast, showSuccessToast, showErrorToast } from "../../components/common/popUp/Loading";
import toast from "react-hot-toast";
import { client } from '../../supabase/client';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Obtener la ruta de destino y el id_proyecto de la URL
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/dashboard-create-project";
  const idProyecto = params.get("id_proyecto");

  useEffect(() => {
    // Si ya está autenticado, redirige
    const checkAuth = async () => {
      const { data: { user } } = await client.auth.getUser();
      if (user) {
        navigate(next);
      }
    };
    checkAuth();
    setFormData({ email: "", password: "" });
    setErrors({});
    // eslint-disable-next-line
  }, [location.pathname, navigate]);

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
        error = "La contraseña debe tener al menos 8 caracteres";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const toastId = showLoadingToast("Ingresando...");

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

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
        localStorage.setItem('token', data.session.access_token);
        setErrors({});
        showSuccessToast("¡Ingreso exitoso!");

        // Solo asociar colaborador si viene por invitación (id_proyecto en la URL)
        if (idProyecto && formData.email) {
          try {
            await fetch("http://localhost:8000/tasks/api/v1/asociar_colaborador/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_proyecto: idProyecto, email: formData.email }),
            });
          } catch (err) {
            showErrorToast("Error al asociar colaborador al proyecto.");
          }
        }

        setTimeout(() => {
          if (idProyecto) {
            navigate(`/dashboard-create-project?id_proyecto=${idProyecto}`);
          } else {
            navigate(next);
          }
        }, 1200);
      }

    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error de login:", error);
      showErrorToast("No se pudo conectar con el servidor.");
      setErrors((prev) => ({
        ...prev,
        password: "No se pudo conectar con el servidor.",
      }));
    }
  };

  const isButtonDisabled = () => {
    return (
      !formData.email ||
      !formData.password ||
      Object.values(errors).some((err) => err)
    );
  };

  return (
    <FormContainer>
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Iniciar sesión</h1>
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
        />
        <PasswordInput
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          errorMessage={errors.password}
          icon="bi-eye-fill"
        />
        <Button
          type="submit"
          disabled={isButtonDisabled()}
          className={`w-full mt-4 ${isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""}`}
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
            to="/recuperar-contrasena"
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