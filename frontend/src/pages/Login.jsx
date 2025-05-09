import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      <h1 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h1>
      <p className="text-gray-400 text-center mb-6">Bienvenido de nuevo</p>
      <form onSubmit={handleSubmit}>
        <Input
          label="Correo Electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          icon="📧"
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          icon="👁️"
        />
        <Button type="submit">Ingresar</Button>
      </form>
      <div className="text-center mt-4">
        <p className="text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link to="/registrarse" className="text-purple-500 hover:underline">
            Regístrate
          </Link>
        </p>
        <p className="text-gray-400 mt-2">
          ¿Olvidaste tu contraseña?{" "}
          <Link
            to="/recuperar-contrasena"
            className="text-purple-500 hover:underline"
          >
            Recuperar contraseña
          </Link>
        </p>
      </div>
    </FormContainer>
  );
};

export default Login;