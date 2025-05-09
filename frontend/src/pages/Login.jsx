import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";

const Login = () => {
  const navigate = useNavigate(); // Declarar useNavigate para redirección
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    navigate("/simulacion"); // Redirigir usando useNavigate
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