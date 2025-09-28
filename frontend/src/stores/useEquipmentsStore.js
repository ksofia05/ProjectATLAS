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
        .select("equipo_numeroSerie, fechaIngreso, comentarioEntrada, comentarioSalida, fechaSalida, agendamiento_equipo")
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
          agendamiento_equipo: ea.agendamiento_equipo,
        };
      });

      // Agrupar por numeroSerie, contar repeticiones y elegir el más reciente por ingreso
      // Con empate por fecha, se elige el de mayor agendamiento_equipo (último insertado)
      const contador = {};
      const ultimoPorSerie = {};
      equiposCompletos.forEach(eq => {
        const serie = eq.numeroSerie;
        if (!contador[serie]) contador[serie] = 0;
        contador[serie]++;

        const prev = ultimoPorSerie[serie];
        if (!prev) {
          ultimoPorSerie[serie] = eq;
        } else {
          const fPrev = new Date(prev.ingreso);
          const fCurr = new Date(eq.ingreso);
          if (fCurr > fPrev) {
            ultimoPorSerie[serie] = eq;
          } else if (+fCurr === +fPrev) {
            const idPrev = Number(prev.agendamiento_equipo) || 0;
            const idCurr = Number(eq.agendamiento_equipo) || 0;
            if (idCurr > idPrev) {
              ultimoPorSerie[serie] = eq;
            }
          }
        }
      });

      const equiposUnicos = Object.keys(contador).map(numSerie => ({
        ...ultimoPorSerie[numSerie],
        repeticiones: contador[numSerie]
      }));

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