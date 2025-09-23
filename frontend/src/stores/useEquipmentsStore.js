import { create } from 'zustand';
import { client } from '../supabase/client';

const useEquipmentsStore = create((set, get) => ({
  // Estado
  equiposByCliente: {},
  loading: false,
  error: null,

  // Acciones
  getEquiposByCliente: (dni) => {
    const state = get();
    return state.equiposByCliente[dni] || { equipos: [], loading: false, lastFetch: 0 };
  },

  fetchEquiposByCliente: async (cliente) => {
    if (!cliente?.dni) return;

    const state = get();
    const now = Date.now();
    const cached = state.equiposByCliente[cliente.dni];
    
    // evitar refetch innecesario
    if (cached && (now - cached.lastFetch < 300000) && cached.equipos.length > 0) {
      console.log(`Usando equipos cacheados para ${cliente.nombre}`);
      return cached.equipos;
    }

    // Marcar como loading
    set(state => ({
      equiposByCliente: {
        ...state.equiposByCliente,
        [cliente.dni]: {
          ...state.equiposByCliente[cliente.dni],
          loading: true
        }
      }
    }));

    try {
      console.log(`Fetching equipos para ${cliente.nombre}...`);

      // Obtener agendamientos del cliente
      const { data: agendamientos, error: errorAg } = await client
        .from("Agendamiento")
        .select("idAgendamiento")
        .eq("Cliente_dni", cliente.dni);

      if (errorAg) throw errorAg;

      if (!agendamientos.length) {
        set(state => ({
          equiposByCliente: {
            ...state.equiposByCliente,
            [cliente.dni]: {
              equipos: [],
              loading: false,
              lastFetch: now
            }
          }
        }));
        return [];
      }

      const idsAgendamiento = agendamientos.map(a => a.idAgendamiento);

      // Obtener equipoagendamiento
      const { data: equipoAgs, error: errorEqAg } = await client
        .from("EquipoAgendamiento")
        .select("equipo_numeroSerie, fechaIngreso, comentarioEntrada, comentarioSalida, fechaSalida")
        .in("agendamiento_idAgendamiento", idsAgendamiento);

      if (errorEqAg) throw errorEqAg;

      if (!equipoAgs.length) {
        set(state => ({
          equiposByCliente: {
            ...state.equiposByCliente,
            [cliente.dni]: {
              equipos: [],
              loading: false,
              lastFetch: now
            }
          }
        }));
        return [];
      }

      const numerosSerie = equipoAgs.map(ea => ea.equipo_numeroSerie);

      // Obtener equipos por números de serie
      const { data: equipos, error: errorEq } = await client
        .from("Equipo")
        .select("*")
        .in("numeroSerie", numerosSerie);

      if (errorEq) throw errorEq;

      // Unir datos de Equipo y EquipoAgendamiento
      const equiposCompletos = equipoAgs.map(ea => {
        const equipo = equipos.find(eq => eq.numeroSerie === ea.equipo_numeroSerie) || {};
        return {
          ...equipo,
          ingreso: ea.fechaIngreso,
          comentarioEntrada: ea.comentarioEntrada,
          comentarioSalida: ea.comentarioSalida,
          salida: ea.fechaSalida,
        };
      });

      // Agrupar por numeroSerie y contar repeticiones
      const contador = {};
      equiposCompletos.forEach(eq => {
        if (!contador[eq.numeroSerie]) contador[eq.numeroSerie] = 0;
        contador[eq.numeroSerie]++;
      });

      const equiposUnicos = Object.keys(contador).map(numSerie => {
        const eq = equiposCompletos.find(e => e.numeroSerie === numSerie);
        return { ...eq, repeticiones: contador[numSerie] };
      });

      // Guardar en store
      set(state => ({
        equiposByCliente: {
          ...state.equiposByCliente,
          [cliente.dni]: {
            equipos: equiposUnicos,
            loading: false,
            lastFetch: now
          }
        },
        error: null
      }));

      console.log(`Equipos cargados para ${cliente.nombre}:`, equiposUnicos.length);
      return equiposUnicos;

    } catch (error) {
      console.error('Error fetching equipos:', error);
      
      set(state => ({
        equiposByCliente: {
          ...state.equiposByCliente,
          [cliente.dni]: {
            equipos: [],
            loading: false,
            lastFetch: now
          }
        },
        error: error.message
      }));
      
      return [];
    }
  },

  // Limpiar cache de un cliente específico
  clearClienteEquipos: (dni) => {
    set(state => {
      const newEquiposByCliente = { ...state.equiposByCliente };
      delete newEquiposByCliente[dni];
      return { equiposByCliente: newEquiposByCliente };
    });
  },

  // Limpiar todo el cache
  clearAllEquipos: () => {
    set({ equiposByCliente: {}, error: null });
  },

  // Precargar equipos de múltiples clientes
  preloadEquipos: async (clientes) => {
    const promises = clientes.map(cliente => 
      get().fetchEquiposByCliente(cliente)
    );
    await Promise.all(promises);
  }
}));

export default useEquipmentsStore;