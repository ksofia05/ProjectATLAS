import React, { useState } from "react";
import {showErrorToast, showSuccessToast,} from "../../components/common/popUp/Loading";
import FloatingModal from "../common/popUp/FloatingModal";
import { API_BASE } from "../../api/apiBase";

const ModalNuevoProyecto = ({ visible, onClose, onCreate }) => {
  const [nombre, setNombre] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!visible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!nombre.trim()) {
      showErrorToast("Por favor, ingresa un nombre para el proyecto.");
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE}tasks/api/v1/save_proyect/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nombreproyecto: nombre }),
      });
      if (response.ok) {
        const { proyecto } = await response.json();
        showSuccessToast("Proyecto creado con éxito.");
        onClose();
        setNombre("");
        if (onCreate) {
          onCreate(proyecto);
          if (window.refreshUserAndProjects) {
            window.refreshUserAndProjects();
          }
        }
      } else {
        const errorData = await response.json();
        if (errorData.mensaje === "ya tiene un proyecto asociado a su cuenta") {
          showErrorToast("Ya tienes un proyecto asociado a tu cuenta.");
          setNombre("");
        } else {
          showErrorToast("Error al crear el proyecto.");
        }
      }
    } catch (error) {
      showErrorToast("Error al guardar proyecto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FloatingModal onClose={onClose} showClose={false}>
      {({ handleClose }) => (
        <>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
            <i className="bi bi-folder-fill text-yellow-400 text-2xl"></i>
            Nuevo proyecto
          </h2>
          <p className="text-gray-300 mb-6">
            ¿Qué nombre recibirá tu proyecto?
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full bg-[#232336] text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg mb-6"
              placeholder="Nombre del proyecto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
              disabled={isSubmitting}
            />
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-700 text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold ml-2 transition
                  ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}
                `}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando..." : "Crear Proyecto"}
              </button>
            </div>
          </form>
        </>
      )}
    </FloatingModal>
  );
};

export default ModalNuevoProyecto;
