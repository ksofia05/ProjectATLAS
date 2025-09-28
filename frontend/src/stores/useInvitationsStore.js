import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INVITE_TTL_SECONDS = 60;
function normalizeExpiracion(inv) {
  if (inv.expiracion) return inv;
  if (inv.fecha_invitacion) {
    const ts = Math.floor(new Date(inv.fecha_invitacion).getTime() / 1000);
    return { ...inv, expiracion: ts + INVITE_TTL_SECONDS };
  }
        // Si no tiene fecha, expira en 1 minuto desde ahora
  return { ...inv, expiracion: Math.floor(Date.now() / 1000) + INVITE_TTL_SECONDS };
}

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
        
        const now = Math.floor(Date.now() / 1000);
        return todasLasInvitaciones
          .map(normalizeExpiracion)
          .filter(inv =>
            inv.email &&
            !emailsColaboradores.includes(inv.email.toLowerCase()) &&
            now < inv.expiracion // Solo si no ha expirado
          );
      },

      filterPendingInvitations: (projectId, colaboradoresActivos = []) => {
        if (!projectId) return;
        const pendientes = get().invitacionesPendientes[projectId] || [];
        const emailsColaboradores = colaboradoresActivos
          .map(c => c.correo ? c.correo.toLowerCase() : '')
          .filter(email => email);

        const now = Math.floor(Date.now() / 1000);
        const invitacionesFiltradas = pendientes
          .map(normalizeExpiracion)
          .filter(inv =>
            inv.email &&
            !emailsColaboradores.includes(inv.email.toLowerCase()) &&
            now < inv.expiracion
          );

        set(state => ({
          invitacionesPendientes: {
            ...state.invitacionesPendientes,
            [projectId]: invitacionesFiltradas
          }
        }));
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
                    expiracion: Math.floor(Date.now() / 1000) + 60, // 1 minuto desde ahora
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
      filterPendingInvitations: (projectId, colaboradoresActivos = []) => {
        if (!projectId) return;
        const pendientes = get().invitacionesPendientes[projectId] || [];
        const emailsColaboradores = colaboradoresActivos
          .map(c => c.correo ? c.correo.toLowerCase() : '')
          .filter(email => email);

        const now = Math.floor(Date.now() / 1000);
        const invitacionesFiltradas = pendientes
          .map(normalizeExpiracion)
          .filter(inv =>
            inv.email &&
            !emailsColaboradores.includes(inv.email.toLowerCase()) &&
            now < inv.expiracion
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
      }),
      onRehydrateStorage: () => {
        return () => {
          try {
            const state = get();
            const proyectos = Object.keys(state.invitacionesPendientes || {});
            proyectos.forEach((pid) => {
              // Limpia expiradas al cargar
              localStorage.removeItem('invitations-storage');
              const pendientes = state.invitacionesPendientes[pid] || [];
              const now = Math.floor(Date.now() / 1000);
              const filtradas = pendientes
                .map(normalizeExpiracion)
                .filter(inv => inv.email && now < inv.expiracion);
              set((s) => ({
                invitacionesPendientes: {
                  ...s.invitacionesPendientes,
                  [pid]: filtradas
                }
              }));
            });
          } catch {}
        };
      }
    }
  )
);

export default useInvitationsStore;