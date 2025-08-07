import { create } from "zustand";
import { persist } from "zustand/middleware";

const useInvitationsStore = create(
  persist(
    (set, get) => ({
      sentInvitations: {},

      addSentInvitation: (projectId, email, nombreInvitador) => {
        set((state) => {
          const projectInvitations = state.sentInvitations[projectId] || [];

          if (projectInvitations.some((inv) => inv.email === email)) {
            return state;
          }

          return {
            sentInvitations: {
              ...state.sentInvitations,
              [projectId]: [
                ...projectInvitations,
                {
                  email,
                  fecha_invitacion: new Date().toISOString(),
                  nombre_invitador: nombreInvitador,
                  estado: "pendiente",
                },
              ],
            },
          };
        });
      },

      // Con esta cosita de aqui se limpian las invitaciones que ya se convirtieron en colaboradores
      filterPendingInvitations: (projectId, collaborators) => {
        set((state) => {
          const projectInvitations = state.sentInvitations[projectId] || [];
          const collaboratorEmails = collaborators.map((c) =>
            c.correo?.toLowerCase()
          );

          // Esto es para mantener solo las invitaciones que aún están pendientes (No estan relacionadas con colaboradores)
          const stillPending = projectInvitations.filter(
            (inv) => !collaboratorEmails.includes(inv.email.toLowerCase())
          );

          return {
            sentInvitations: {
              ...state.sentInvitations,
              [projectId]: stillPending,
            },
          };
        });
      },

      getPendingInvitations: (projectId, collaborators = []) => {
        const state = get();
        const projectInvitations = state.sentInvitations[projectId] || [];
        const collaboratorEmails = collaborators.map((c) =>
          c.correo?.toLowerCase()
        );

        // Filtrar automáticamente los que ya son colaboradores
        return projectInvitations.filter(
          (inv) => !collaboratorEmails.includes(inv.email.toLowerCase())
        );
      },

      clearProjectInvitations: (projectId) => {
        set((state) => {
          const newSentInvitations = { ...state.sentInvitations };
          delete newSentInvitations[projectId];
          return { sentInvitations: newSentInvitations };
        });
      },
    }),
    {
      name: "sent-invitations-storage",
      version: 1,
    }
  )
);

export default useInvitationsStore;
