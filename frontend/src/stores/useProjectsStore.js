import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API_BASE_URL from '../api/apiBase';
const useProjectStore = create(
  persist(
    (set, get) => ({
      projectName: '',
      isLoading: false,
      lastProjectId: null,

      // Cargar información del proyecto
      fetchProjectInfo: async (projectId) => {
        if (!projectId) return;
        
        // Si ya tenemos datos para este proyecto, no volver a cargar
        const { lastProjectId, projectName } = get();
        if (lastProjectId === projectId && projectName) {
          console.log("Proyecto ya en cache, no recargando...");
          return;
        }

        set({ isLoading: true });

        const endpoints = [
          `${API_BASE_URL}/tasks/api/v1/info_proyecto_colaboradores/?id_proyecto=${projectId}`,
          `${API_BASE_URL}/tasks/api/v1/filtro_colaborador/?id_proyecto=${projectId}`
        ];

        try {
          // Hacer peticiones en serie (como estaba en el original sendColaborations.jsx)
          for (const endpoint of endpoints) {
            try {
              const response = await fetch(endpoint);
              if (!response.ok) continue;
              
              const data = await response.json();
              
              // Verificar si tiene nombre del proyecto
              const nombreProyecto = data.nombreproyecto || data.nombre_proyecto || 'Proyecto sin nombre';
              
              if (nombreProyecto) {
                set({
                  projectName: nombreProyecto,
                  lastProjectId: projectId,
                  isLoading: false
                });
                console.log("Proyecto cargado:", nombreProyecto);
                return; // Salir si encontramos datos válidos
              }
            } catch (endpointError) {
              console.warn(`Endpoint ${endpoint} falló:`, endpointError);
              continue; // Continuar con el siguiente endpoint
            }
          }
          
          // Si llegamos aquí, ningún endpoint funcionó :,v
          console.warn("No se pudo cargar el nombre del proyecto");
          set({
            projectName: `Proyecto ${projectId}`, // Fallback o respaldo
            lastProjectId: projectId,
            isLoading: false
          });
          
        } catch (error) {
          console.error("Error general cargando proyecto:", error);
          set({
            projectName: `Proyecto ${projectId}`, // Fallback o respaldo del respaldo, para errores
            lastProjectId: projectId,
            isLoading: false
          });
        }
      },

      // Invalidar cache (para forzar recarga)
      invalidateCache: () => set({ 
        lastProjectId: null,
        projectName: ''
      }),

      // Limpiar proyecto
      clearProject: () => set({ 
        projectName: '', 
        lastProjectId: null 
      })
    }),
    {
      name: 'project-storage', // Persistir en localStorage
      getStorage: () => localStorage
    }
  )
);

export default useProjectStore;