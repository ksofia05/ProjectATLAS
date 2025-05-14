import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
// import PasswordInput from "../components/PasswordInput";
// import AnimatedContainer from "../components/AnimatedContainer"; // Importar el contenedor animado

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

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

    try {
      const response = await fetch("http://localhost:8000/tasks/api/v1/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Inicio de sesión exitoso");
        console.log("Usuario autenticado:", data.usuario);
        navigate("/simulacion");
      } else {
        alert(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("No se pudo conectar con el servidor.");
    }
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
          <Input
            label="Contraseña"
            name="password"
            value={formData.password}
            onChange={handleChange}
            errorMessage={errors.password}
          />
          <Button type="submit">Ingresar</Button>
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