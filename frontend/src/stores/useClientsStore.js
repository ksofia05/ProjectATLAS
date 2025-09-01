import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import axios from 'axios';

const useClientsStore = create(
  subscribeWithSelector((set, get) => ({
    // Estado
    clientes: [],
    loading: false,
    error: null,
    lastFetch: null,
    usuarioIdActual: null,
    idProyecto: null,
    initialized: false,

    // Acciones
    setLoading: (loading) => set({ loading }),
    
    setError: (error) => set({ error }),
    
    setUsuarioData: (usuarioId, proyectoId) => 
      set({ usuarioIdActual: usuarioId, idProyecto: proyectoId }),

    // Función para obtener clientes del servidor
    fetchClientes: async (email, forceRefresh = false) => {
      const state = get();
      
      // Si ya tenemos datos y no es un refresh forzado, no hacer nada
      if (state.clientes.length > 0 && state.initialized && !forceRefresh) {
        return;
      }

      set({ loading: true, error: null });

      try {
        // Obtener usuario
        const usuarioRes = await axios.get(
          `http://localhost:8000/tasks/api/v1/usuarios/?correoelectronico=${email}`
        );
        
        if (!usuarioRes.data || usuarioRes.data.length === 0) {
          throw new Error('Usuario no encontrado');
        }

        const usuarioId = usuarioRes.data[0].idusuario;

        // Obtener proyectos
        const proyectosRes = await axios.get(
          `http://localhost:8000/tasks/api/v1/Proyecto/?id_usuario=${usuarioId}`
        );
        
        const proyectos = proyectosRes.data;

        if (proyectos.length === 0) {
          set({
            clientes: [],
            usuarioIdActual: usuarioId,
            idProyecto: null,
            loading: false,
            initialized: true,
            lastFetch: new Date().getTime(),
          });
          return;
        }

        const idProyecto = proyectos[0].id_proyecto;

        // Obtener clientes
        const clientesRes = await axios.get(
          `http://localhost:8000/tasks/api/v1/clientes_por_proyecto/?id_proyecto=${idProyecto}`
        );

        set({
          clientes: clientesRes.data.clientes || [],
          usuarioIdActual: usuarioId,
          idProyecto: idProyecto,
          loading: false,
          error: null,
          initialized: true,
          lastFetch: new Date().getTime(),
        });

      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        set({
          clientes: [],
          usuarioIdActual: null,
          idProyecto: null,
          loading: false,
          error: error.message || 'Error al cargar clientes',
          initialized: true,
        });
      }
    },

    // ✅ Función mejorada para agregar un nuevo cliente (optimistic update)
    addCliente: (nuevoCliente) => {
      const state = get();
      
      // Verificar si el cliente ya existe (evitar duplicados)
      const clienteExistente = state.clientes.find(
        cliente => cliente.dni === nuevoCliente.dni || cliente.id === nuevoCliente.id
      );
      
      if (clienteExistente) {
        // Si existe, actualizar en lugar de agregar duplicado
        const clientesActualizados = state.clientes.map(cliente =>
          (cliente.dni === nuevoCliente.dni || cliente.id === nuevoCliente.id)
            ? { ...cliente, ...nuevoCliente }
            : cliente
        );
        
        set({
          clientes: clientesActualizados,
          lastFetch: new Date().getTime(),
        });
      } else {
        // Si no existe, agregarlo al principio de la lista
        set({
          clientes: [nuevoCliente, ...state.clientes],
          lastFetch: new Date().getTime(),
        });
      }
      
      console.log('Cliente agregado/actualizado en el store:', nuevoCliente);
    },

    // Función para actualizar un cliente existente
    updateCliente: (clienteId, clienteActualizado) => {
      const state = get();
      const clientesActualizados = state.clientes.map(cliente =>
        cliente.id === clienteId ? { ...cliente, ...clienteActualizado } : cliente
      );
      set({ 
        clientes: clientesActualizados,
        lastFetch: new Date().getTime(),
      });
    },

    // Función para eliminar un cliente
    removeCliente: (clienteId) => {
      const state = get();
      const clientesFiltrados = state.clientes.filter(cliente => cliente.id !== clienteId);
      set({ 
        clientes: clientesFiltrados,
        lastFetch: new Date().getTime(),
      });
    },

    // ✅ Función mejorada para refrescar datos
    refreshClientes: async (email) => {
      // Opcionalmente, puedes mantener los datos actuales mientras cargas los nuevos
      const state = get();
      console.log('Refrescando clientes...');
      
      try {
        await get().fetchClientes(email, true);
        console.log('Clientes refrescados exitosamente');
      } catch (error) {
        console.error('Error al refrescar clientes:', error);
        // En caso de error, mantener los datos actuales
      }
    },

    // Función para resetear el store
    reset: () => set({
      clientes: [],
      loading: false,
      error: null,
      lastFetch: null,
      usuarioIdActual: null,
      idProyecto: null,
      initialized: false,
    }),

    // Selector para obtener clientes filtrados
    getClientesFiltrados: (estadoSeleccionado, searchTerm) => {
      const state = get();
      return state.clientes.filter(
        (item) =>
          (estadoSeleccionado === "todos" || item.estado === estadoSeleccionado) &&
          ((item.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (item.apellido?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (item.correo?.toLowerCase() || "").includes(searchTerm.toLowerCase()))
      );
    },

    // ✅ Nueva función para verificar si necesita refrescar datos
    shouldRefresh: () => {
      const state = get();
      const now = new Date().getTime();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutos en milisegundos
      
      return !state.lastFetch || (now - state.lastFetch) > fiveMinutes;
    },
  }))
);

export default useClientsStore;