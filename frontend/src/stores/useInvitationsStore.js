import { create } from 'zustand';

const useInvitationsStore = create((set, get) => ({
  // Estado
  invitacionesPendientes: {}, // { [projectId]: [{ email, fecha_invitacion, nombre_invitador }] }
  invitacionesOptimistas: {}, // { [projectId]: [{ email, fecha_invitacion, nombre_invitador, isOptimistic: true }] }
  loading: false,

  // Obtener invitaciones pendientes (incluyendo optimistas)
  getPendingInvitations: (projectId, colaboradoresActivos = []) => {
    if (!projectId) return [];
    
    const state = get();
    const pendientes = state.invitacionesPendientes[projectId] || [];
    const optimistas = state.invitacionesOptimistas[projectId] || [];
    
    // Combinar invitaciones reales + optimistas
    const todasLasInvitaciones = [...pendientes, ...optimistas];
    
    // Filtrar las que ya son colaboradores activos
    const emailsColaboradores = colaboradoresActivos
      .map(c => c.correo ? c.correo.toLowerCase() : '')
      .filter(email => email);
    
    return todasLasInvitaciones.filter(inv => 
      inv.email && !emailsColaboradores.includes(inv.email.toLowerCase())
    );
  },

  // Agregar invitación optimista (mostrar inmediatamente)
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
    
    console.log('Invitación optimista agregada:', email);
  },

  // Confirmar invitación optimista (cuando el servidor responde OK)
 confirmOptimisticInvitation: (projectId, email) => {
  if (!projectId || !email) return;

  set(state => {
    const optimistas = state.invitacionesOptimistas[projectId] || [];
    const invitacionConfirmada = optimistas.find(inv => 
      inv.email && inv.email.toLowerCase() === email.toLowerCase()
    );

    if (invitacionConfirmada) {
      // Remover de optimistas
      const nuevasOptimistas = optimistas.filter(inv => 
        !inv.email || inv.email.toLowerCase() !== email.toLowerCase()
      );

      // Agregar a pendientes reales
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
              isOptimistic: false, // Ya no es optimista
              fecha_invitacion: new Date().toISOString() //  Actualizar fecha real
            }
          ]
        }
      };
    }
    return state;
  });
  
  console.log('Invitación confirmada y movida a pendientes:', email);
},

  //  Cancelar invitación optimista (cuando el servidor responde ERROR)
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
    
    console.log('Invitación optimista cancelada:', email);
  },

  //  Agregar invitación confirmada (desde el servidor)
  addSentInvitation: (projectId, email, nombreInvitador) => {
    if (!projectId || !email) return;

    set(state => ({
      invitacionesPendientes: {
        ...state.invitacionesPendientes,
        [projectId]: [
          ...(state.invitacionesPendientes[projectId] || []),
          {
            email: email.trim(),
            fecha_invitacion: new Date().toISOString(),
            nombre_invitador: nombreInvitador,
            isOptimistic: false,
            id: `confirmed-${Date.now()}`
          }
        ]
      }
    }));
  },

  //  CORREGIDO: Filtrar invitaciones pendientes
  filterPendingInvitations: async (projectId, colaboradoresActivos = []) => {
    if (!projectId) return;
    
    set(state => ({ loading: true }));

    try {
      // Usar nombres de propiedades correctos del estado
      const pendientes = get().invitacionesPendientes[projectId] || [];
      
      // Filtrar las que ya no son relevantes
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
        },
        loading: false
      }));
      
      console.log('Invitaciones filtradas para proyecto:', projectId);
      
    } catch (error) {
      console.error('Error filtrando invitaciones:', error);
      set(state => ({ loading: false }));
    }
  },

  // Limpiar invitaciones de un proyecto
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
}));

export default useInvitationsStore;