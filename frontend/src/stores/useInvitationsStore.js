import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API_BASE_URL from '../api/apiBase';
const useInvitationsStore = create(
  persist(
    (set, get) => ({
      // Estado
      invitacionesPendientes: {}, 
      invitacionesOptimistas: {}, 
      loading: false,

      //  Obtener invitaciones pendientes (incluyendo optimistas)
      getPendingInvitations: (projectId, colaboradoresActivos = []) => {
        if (!projectId) return [];
        
        const state = get();
        const pendientes = state.invitacionesPendientes[projectId] || [];
        const optimistas = state.invitacionesOptimistas[projectId] || [];
        
        const todasLasInvitaciones = [...pendientes, ...optimistas];
        
        const emailsColaboradores = colaboradoresActivos
          .map(c => c.correo ? c.correo.toLowerCase() : '')
          .filter(email => email);
        
        return todasLasInvitaciones.filter(inv => 
          inv.email && !emailsColaboradores.includes(inv.email.toLowerCase())
        );
      },

      //  NUEVO: Sincronizar invitaciones desde el servidor
      syncInvitationsFromServer: async (projectId) => {
        if (!projectId) return;

        set(state => ({ loading: true }));
        
        try {
          const response = await fetch(
            `${API_BASE_URL}/tasks/api/v1/invitacionesProyecto/${projectId}/`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            }
          );

          if (response.ok) {
            const data = await response.json();
            const invitacionesServidor = data.invitaciones || [];

            set(state => ({
              invitacionesPendientes: {
                ...state.invitacionesPendientes,
                [projectId]: invitacionesServidor.map(inv => ({
                  email: inv.email,
                  fecha_invitacion: inv.fecha_invitacion,
                  nombre_invitador: inv.nombre_invitador,
                  isOptimistic: false,
                  id: `server-${inv.id}`
                }))
              },
              loading: false
            }));

            console.log(' Invitaciones sincronizadas desde servidor para proyecto:', projectId);
          } else {
            console.warn('No se pudieron obtener invitaciones del servidor');
            set(state => ({ loading: false }));
          }
        } catch (error) {
          console.error('Error sincronizando invitaciones:', error);
          set(state => ({ loading: false }));
        }
      },

      //  Agregar invitación optimista
      addOptimisticInvitation: (projectId, email, nombreInvitador) => {
        if (!projectId || !email || !nombreInvitador) return;

        set(state => ({
          invitacionesOptimistas: {
            ...state.invitacionesOptimistas,
            [projectId]: [
              ...(state.invitacionesOptimistas[projectId] || []),
              {
                email: email.trim(),
                fecha_invitacion: new Date().toISOString(),
                nombre_invitador: nombreInvitador,
                isOptimistic: true,
                id: `optimistic-${Date.now()}-${Math.random()}`
              }
            ]
          }
        }));
        
        console.log(' Invitación optimista agregada:', email);
      },

      //  Confirmar invitación optimista
      confirmOptimisticInvitation: (projectId, email) => {
        if (!projectId || !email) return;

        set(state => {
          const optimistas = state.invitacionesOptimistas[projectId] || [];
          const invitacionConfirmada = optimistas.find(inv => 
            inv.email && inv.email.toLowerCase() === email.toLowerCase()
          );

          if (invitacionConfirmada) {
            const nuevasOptimistas = optimistas.filter(inv => 
              !inv.email || inv.email.toLowerCase() !== email.toLowerCase()
            );

            const pendientesActuales = state.invitacionesPendientes[projectId] || [];
            
            return {
              invitacionesOptimistas: {
                ...state.invitacionesOptimistas,
                [projectId]: nuevasOptimistas
              },
              invitacionesPendientes: {
                ...state.invitacionesPendientes,
                [projectId]: [
                  ...pendientesActuales,
                  {
                    ...invitacionConfirmada,
                    isOptimistic: false,
                    fecha_invitacion: new Date().toISOString(),
                    id: `confirmed-${Date.now()}`
                  }
                ]
              }
            };
          }
          return state;
        });
        
        console.log(' Invitación optimista confirmada:', email);
      },

      //  Cancelar invitación optimista
      cancelOptimisticInvitation: (projectId, email) => {
        if (!projectId || !email) return;

        set(state => {
          const optimistas = state.invitacionesOptimistas[projectId] || [];
          const nuevasOptimistas = optimistas.filter(inv => 
            !inv.email || inv.email.toLowerCase() !== email.toLowerCase()
          );

          return {
            invitacionesOptimistas: {
              ...state.invitacionesOptimistas,
              [projectId]: nuevasOptimistas
            }
          };
        });
        
        console.log(' Invitación optimista cancelada:', email);
      },

      //  Filtrar invitaciones pendientes (mejorado con sync)
      filterPendingInvitations: async (projectId, colaboradoresActivos = []) => {
        if (!projectId) return;
        
        // Primero sincronizar desde servidor
        await get().syncInvitationsFromServer(projectId);
        
        // Luego filtrar localmente
        const pendientes = get().invitacionesPendientes[projectId] || [];
        const emailsColaboradores = colaboradoresActivos
          .map(c => c.correo ? c.correo.toLowerCase() : '')
          .filter(email => email);
        
        const invitacionesFiltradas = pendientes.filter(inv => 
          inv.email && !emailsColaboradores.includes(inv.email.toLowerCase())
        );
        
        set(state => ({
          invitacionesPendientes: {
            ...state.invitacionesPendientes,
            [projectId]: invitacionesFiltradas
          }
        }));
        
        console.log(' Invitaciones filtradas para proyecto:', projectId);
      },

      //  Limpiar invitaciones de un proyecto
      clearProjectInvitations: (projectId) => {
        if (!projectId) return;

        set(state => {
          const nuevasPendientes = { ...state.invitacionesPendientes };
          const nuevasOptimistas = { ...state.invitacionesOptimistas };
          
          delete nuevasPendientes[projectId];
          delete nuevasOptimistas[projectId];
          
          return {
            invitacionesPendientes: nuevasPendientes,
            invitacionesOptimistas: nuevasOptimistas
          };
        });
      },

      //  Limpiar todas las invitaciones
      clearAllInvitations: () => {
        set({
          invitacionesPendientes: {},
          invitacionesOptimistas: {},
          loading: false
        });
      }
    }),
    {
      name: 'invitations-storage', //  Nombre para localStorage
      partialize: (state) => ({ 
        //  Solo persistir invitaciones confirmadas, no optimistas
        invitacionesPendientes: state.invitacionesPendientes 
      })
    }
  )
);

export default useInvitationsStore;