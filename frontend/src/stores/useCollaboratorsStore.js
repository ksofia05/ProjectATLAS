import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useCollaboratorsStore = create(
  persist(
    (set, get) => ({
      collaborators: [],
      isLoading: false,
      lastProjectId: null,
      lastUpdated: null,

      // Cargar colaboradores del proyecto
      fetchCollaborators: async (projectId) => {
        if (!projectId) return;

        const { lastProjectId, collaborators, lastUpdated } = get();

        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const shouldRefresh =
          lastProjectId !== projectId ||
          collaborators.length === 0 ||
          !lastUpdated ||
          lastUpdated < fiveMinutesAgo;

        if (!shouldRefresh) {
          console.log("Colaboradores ya en cache y recientes");
          return;
        }

        console.log("Cargando colaboradores del servidor...");
        set({ isLoading: true });

        try {
          const response = await axios.get(
            `http://localhost:8000/tasks/api/v1/filtro_colaborador/?id_proyecto=${projectId}`
          );

          const colaboradores = response.data.colaboradores || [];

          const normalizedCollaborators = colaboradores.map((colab) => ({
            ...colab,
            id: colab.id || colab.idusuario || colab.idUsuario,
          }));

          set({
            collaborators: normalizedCollaborators,
            lastProjectId: projectId,
            lastUpdated: Date.now(),
            isLoading: false,
          });

          console.log(
            "Colaboradores cargados:",
            normalizedCollaborators.length
          );
        } catch (error) {
          console.error("Error cargando colaboradores:", error);
          set({ isLoading: false });
        }
      },

      // Actualización optimista del estado del colaborador
      updateCollaboratorState: async (colaboradorId, newState) => {
        const { collaborators } = get();

        const updatedCollaborators = collaborators.map((c) =>
          c.id === colaboradorId ? { ...c, estado: newState } : c
        );
        set({
          collaborators: updatedCollaborators,
          lastUpdated: Date.now(),
        });

        try {
          // Actualizar en el backend (Aveces no funciona
          await axios.patch(
            `http://localhost:8000/tasks/api/v1/usuarios/${colaboradorId}/estado/`,
            { estado: newState }
          );

          console.log("Estado actualizado en backend");

          // Aviso a otros componentes para actualizarse
          window.dispatchEvent(
            new CustomEvent("collaboratorStateChanged", {
              detail: { colaboradorId, newState, timestamp: Date.now() },
            })
          );
        } catch (error) {
          console.error("Error actualizando backend:", error);

          // Revertir cambio si falla el backend (mlp)
          const revertedCollaborators = collaborators.map((c) =>
            c.id === colaboradorId
              ? { ...c, estado: newState === "Activo" ? "Inactivo" : "Activo" }
              : c
          );
          set({ collaborators: revertedCollaborators });

          throw error;
        }
      },

      // Marcar colaborador como eliminado
      markCollaboratorAsDeleted: (colaboradorId) => {
        const { collaborators } = get();
        const updatedCollaborators = collaborators.map((c) =>
          c.id === colaboradorId ? { ...c, estado: "eliminado" } : c
        );
        set({
          collaborators: updatedCollaborators,
          lastUpdated: Date.now(),
        });
      },

      // Forzar recarga de colaboradores
      forceRefresh: async (projectId) => {
        if (!projectId) return;

        console.log("Forzando recarga de colaboradores...");
        set({ isLoading: true, lastUpdated: null });

        try {
          const response = await axios.get(
            `http://localhost:8000/tasks/api/v1/filtro_colaborador/?id_proyecto=${projectId}`
          );

          const colaboradores = response.data.colaboradores || [];
          const normalizedCollaborators = colaboradores.map((colab) => ({
            ...colab,
            id: colab.id || colab.idusuario || colab.idUsuario,
          }));

          set({
            collaborators: normalizedCollaborators,
            lastProjectId: projectId,
            lastUpdated: Date.now(),
            isLoading: false,
          });

          console.log("Colaboradores recargados desde servidor");
        } catch (error) {
          console.error("Error recargando colaboradores:", error);
          set({ isLoading: false });
        }
      },

      // Invalidar cache
      invalidateCache: () =>
        set({
          lastProjectId: null,
          collaborators: [],
          lastUpdated: null,
        }),

      // Limpiar store
      clearCollaborators: () =>
        set({
          collaborators: [],
          lastProjectId: null,
          lastUpdated: null,
        }),
    }),
    {
      name: "collaborators-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useCollaboratorsStore;
