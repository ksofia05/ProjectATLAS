import React from "react";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";

const Simulation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center text-white">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md">
        <h1 className="text-4xl font-bold mb-4">Hola :D</h1>
        <p className="text-gray-400 mb-6">
          Esto es solo una simulacion, mas adelante se pondra la vista a la creacion de los proyectos
        </p>
        <div className="flex flex-col gap-4">
          <Button>
            <Link to="/iniciar-sesion" className="text-white">
              Regresar a Inicio de Sesión
            </Link>
          </Button>
          <Button>
            <Link to="/registrarse" className="text-white">
              Regresar a Registro de Usuario
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Simulation;