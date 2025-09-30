import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import {showErrorToast, showSuccessToast,} from "../../components/common/popUp/Loading";
import FloatingModal from "../common/popUp/FloatingModal";
import API_BASE_URL from "../../api/apiBase";
const ModalNuevoProyecto = ({ visible, onClose, onCreate }) => {
  const [nombre, setNombre] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUserProfile } = useAuth();

  if (!visible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    console.log('🔐 Token completo:', token);
    console.log('🔐 Token length:', token ? token.length : 'null');
    console.log('🔐 Token primeros 50 chars:', token ? token.substring(0, 50) : 'null');
    
    if (!nombre.trim()) {
      showErrorToast("Por favor, ingresa un nombre para el proyecto.");
      setIsSubmitting(false);
      return;
    }
    
    console.log('📤 Headers que se enviarán:', headers);
    console.log('📤 URL destino:', `${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/tasks/api/v1/save_proyect/`);
    console.log('📤 Body que se enviará:', { nombreproyecto: nombre });
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/tasks/api/v1/save_proyect/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nombreproyecto: nombre }),
        }
      );
      console.log('📥 Respuesta del servidor:');
      console.log('📥 Status:', response.status);
      console.log('📥 Status Text:', response.statusText);
      console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Respuesta exitosa:', responseData);
        const { proyecto } = responseData;
        if (proyecto) {
          // Refrescar perfil del usuario para obtener rol actualizado
          if (refreshUserProfile) {
            await refreshUserProfile();
          }
          
          showSuccessToast("Proyecto creado con éxito.");
          onClose();
          setNombre("");
          
          if (onCreate) {
            onCreate(proyecto);
          }
          if (window.refreshUserAndProjects) {
            window.refreshUserAndProjects();
          }
        }
      } else {
        console.log('❌ Error del servidor - Status:', response.status);
        try {
          const errorData = await response.json();
          console.log('❌ Error Data:', errorData);
          if (errorData.mensaje === "ya tiene un proyecto asociado a su cuenta") {
            showErrorToast("Ya tienes un proyecto asociado a tu cuenta.");
            setNombre("");
          } else {
            showErrorToast("Error al crear el proyecto.");
          }
        } catch (parseError) {
          console.log('❌ Error parseando respuesta de error:', parseError);
          console.log('❌ Respuesta raw:', await response.text());
          showErrorToast("Error al crear el proyecto.");
        }
      }
    } catch (error) {
      console.log('💥 Error en la petición:', error);
      console.log('💥 Error name:', error.name);
      console.log('💥 Error message:', error.message);
      console.log('💥 Error stack:', error.stack);
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