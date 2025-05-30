import React, { useState } from "react";
import {showErrorToast } from "../../components/common/popUp/Loading";
const ModalNuevoProyecto = ({ visible, onClose, onCreate }) => {
  const [nombre, setNombre] = useState("");
  if (!visible) return null;

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token');
    console.log("TOKEN ENVIADO:", token);
    e.preventDefault();
    if (!nombre.trim()) {
      showErrorToast('Por favor, ingresa un nombre para el proyecto.');
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/tasks/api/v1/save_proyect/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}` // <-- MOVIDO AQUÍ DENTRO
        },
        body: JSON.stringify({ nombreproyecto: nombre }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('proyecto guardado con éxito:', data);
        console.log(`proyecto "${data.nombre}" guardado con éxito!`);
        alert("proyecto creado");
        onClose();
        setNombre('');
      } else {
        const errorData = await response.json();
        console.error('Error al guardar proyecto:', errorData);
      }
    } catch (error) {
      console.error("Error al guardar proyecto :", error);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#181825] rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700 relative">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
          <i className="bi bi-folder-fill text-yellow-400 text-2xl"></i>
          Nuevo proyecto
        </h2>
        <p className="text-gray-300 mb-6">¿Qué nombre recibirá tu proyecto?</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full bg-[#232336] text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg mb-6"
            placeholder="Nombre del proyecto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
          />
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold ml-2 transition"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevoProyecto;