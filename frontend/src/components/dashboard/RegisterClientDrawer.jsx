import React, { useState, useEffect, useRef } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { showSuccessToast, showErrorToast } from "../common/popUp/Loading";
import UploadImageModal from "../layout/uploadImageModal";
import { client as supabase } from "../../supabase/client";

// Funcion para conseguir la fecha de hoy
function getToday() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;




export default function RegisterClientDrawer({ open, onClose, idproyecto, usuarioIdActual }) {
  const [form, setForm] = useState({
    identificacion: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    entrada: getToday(),
    serie: "",
    comentario: "",
    imagen: null,
  });



  // Estado para manejar los resultados de búsqueda y sugerencias
const [searchResults, setSearchResults] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
const [loadingSearch, setLoadingSearch] = useState(false);

useEffect(() => {
  setErrors(validate(form));
}, []);

// Funcion para buscar los clientes por coincidencia mientras se escribe el ID
const handleIdInputChange = async (e) => {
  const { value } = e.target;
  handleChange(e);

  if (!value || !/^\d+$/.test(value)) {
    setSearchResults([]);
    setShowSuggestions(false);
    return;
  }

  setLoadingSearch(true);

  const min = Number(value);
  const max = Number(value + "9".repeat(10 - value.length));

  const { data, error } = await supabase
    .from("Cliente")
    .select("*")
    .gte("dni", min)
    .lte("dni", max)
    .limit(20);

  setLoadingSearch(false);

  if (error) {
    setSearchResults([]);
    setShowSuggestions(false);
    return;
  }

  // Solo necesito que se muestren los que empiezan con ESOS NUMEROS
  const filtered = (data || []).filter(cliente =>
    String(cliente.dni).startsWith(value)
  );

  if (filtered.length > 0) {
    setSearchResults(filtered.slice(0, 5)); // Por ahora solo se mostraran 5 resultados como maximo
    setShowSuggestions(true);
  } else {
    setSearchResults([]);
    setShowSuggestions(false);
  }
};

const [loadingSerie, setLoadingSerie] = useState(false);  //Estado para mostrar una carga al buscar la serie

// Con esto se autocompleta el formulario al hacer clic en una opcion o resultado posible
const handleSuggestionClick = async (cliente) => {
  setForm((prev) => ({
    ...prev,
    identificacion: cliente.dni,
    nombre: cliente.nombre || "",
    apellido: cliente.apellido || "",
    email: cliente.correo || "",
    telefono: cliente.telefono || "",
    serie: "",
  }));
  setShowSuggestions(false);

  setLoadingSerie(true);

  // 1. Buscar el último agendamiento del cliente
  const { data: agendamientos, error: agendamientoError } = await supabase
    .from("Agendamiento")
    .select("idAgendamiento")
    .eq("Cliente_dni", cliente.dni)
    .order("idAgendamiento", { ascending: false })
    .limit(1);

  if (agendamientoError || !agendamientos || agendamientos.length === 0) {
    setLoadingSerie(false);
    return;
  }

  const agendamientoId = agendamientos[0].idAgendamiento;

  // 2. Buscar el EquipoAgendamiento relacionado
  const { data: equipoAg, error: equipoAgError } = await supabase
    .from("EquipoAgendamiento")
    .select("equipo_numeroSerie")
    .eq("agendamiento_idAgendamiento", agendamientoId)
    .order("agendamiento_equipo", { ascending: false })
    .limit(1);

  setLoadingSerie(false);

  if (equipoAgError || !equipoAg || equipoAg.length === 0) return;

  const numeroSerie = equipoAg[0].equipo_numeroSerie;

  // 3. Autocompletar el campo serie
  setForm((prev) => ({
    ...prev,
    serie: numeroSerie || "",
  }));
};

  
  const [isSubmitting, setIsSubmitting] = useState(false); //Estado para saber si se esta enviando el formulario


  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const inputIdRef = useRef();
  const timeoutRef = useRef();

  useEffect(() => {
    if (open) {
      setMounted(true);
      timeoutRef.current = setTimeout(() => setShowDrawer(true), 10);
    } else if (mounted) {
      setShowDrawer(false);
      timeoutRef.current = setTimeout(() => setMounted(false), 300);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [open, mounted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => {
      const newForm = { ...form, [name]: value };
      return validate(newForm);
    });
    };

  // Cuando se guarda la imagen desde el modal
  const handleImageSave = (publicUrl) => {
    setForm(prev => {
      const newForm = { ...prev, imagen: publicUrl };
      setErrors(validate(newForm));
      return newForm;
    });
    setShowUploadModal(false);
  };

  const handleRemoveImage = () => {
    setForm(prev => {
      const newForm = { ...prev, imagen: null };
      setErrors(validate(newForm));
      return newForm;
    });
  };

  // Validación de campos
  const validate = (customForm = form) => {
    const newErrors = {};
    if (!customForm.identificacion) {
      newErrors.identificacion = "Campo obligatorio";
    } else if (!/^\d+$/.test(customForm.identificacion)) {
      newErrors.identificacion = "Solo números";
    }
    if (!customForm.nombre) newErrors.nombre = "Campo obligatorio";
    if (!customForm.apellido) newErrors.apellido = "Campo obligatorio";
    if (!customForm.email) {
      newErrors.email = "Campo obligatorio";
    } else if (!emailRegex.test(customForm.email)) {
      newErrors.email = "Correo inválido";
    }
    if (!customForm.telefono) {
      newErrors.telefono = "Campo obligatorio";
    } else if (!/^\d+$/.test(customForm.telefono)) {
      newErrors.telefono = "Solo números";
    }
    if (!customForm.entrada) newErrors.entrada = "Campo obligatorio";
    if (!customForm.serie) newErrors.serie = "Campo obligatorio";
    if (!customForm.comentario) newErrors.comentario = "Campo obligatorio";
    if (!customForm.imagen) newErrors.imagen = "Debes adjuntar una imagen";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // 1. Insertar cliente (si no existe)
      let clienteData;
      let clienteError;
      const { data: existingCliente, error: searchError } = await supabase
        .from("Cliente")
        .select("*")
        .eq("dni", form.identificacion)
        .single();

      if (existingCliente) {
        clienteData = existingCliente;
      } else {
        const insertResult = await supabase
          .from("Cliente")
          .insert([
            {
              dni: Number(form.identificacion),
              nombre: form.nombre,
              apellido: form.apellido,
              correo: form.email,
              telefono: form.telefono,
              proyecto: Number(idproyecto),
            },
          ])
          .select()
          .single();

        clienteData = insertResult.data;
        clienteError = insertResult.error;
      }

      if (clienteError) throw clienteError;

      // 2. Insertar equipo (si no existe)
      let equipoData;
      let equipoError;
      const { data: existingEquipo, error: equipoSearchError } = await supabase
        .from("Equipo")
        .select("*")
        .eq("numeroSerie", form.serie)
        .single();

      if (existingEquipo) {
        equipoData = existingEquipo;
      } else {
        const insertEquipo = await supabase
          .from("Equipo")
          .insert([
            {
              numeroSerie: form.serie,
              marca: "",
            },
          ])
          .select()
          .single();
        equipoData = insertEquipo.data;
        equipoError = insertEquipo.error;
      }

      if (equipoError) throw equipoError;

      // 3. Insertar agendamiento
      const { data: agendamientoData, error: agendamientoError } = await supabase
        .from("Agendamiento")
        .insert([
          {
            Cliente_dni: clienteData.dni,
            Usuario_id: usuarioIdActual,
          },
        ])
        .select()
        .single();

      if (agendamientoError) throw agendamientoError;

      // 4. Insertar en EquipoAgendaminto
      const { error: equipoAgendamientoError } = await supabase
        .from("EquipoAgendamiento")
        .insert([
          {
            fechaIngreso: form.entrada,
            comentarioEntrada: form.comentario,
            Estado: "Activo",
            equipo_numeroSerie: equipoData.numeroSerie,
            agendamiento_idAgendamiento: agendamientoData.idAgendamiento,
          },
        ]);

      if (equipoAgendamientoError) throw equipoAgendamientoError;

      showSuccessToast("Cliente registrado");
      onClose();
    } catch (err) {
      console.error("Error al registrar cliente/equipo:", err);
      if (err && err.message) {
        showErrorToast(err.message);
      } else {
        showErrorToast("Error al registrar cliente/equipo");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Fondo con un blur */}
      <div
        className={`
          fixed inset-0 transition-all duration-300
          ${showDrawer ? "backdrop-blur-[2px] bg-black/5 pointer-events-auto" : "backdrop-blur-0 bg-transparent pointer-events-none"}
        `}
        onClick={onClose}
        aria-label="Cerrar panel"
      />
      {/* Efectos del panel */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full max-w-md bg-[#181825] shadow-2xl p-8 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${showDrawer ? "translate-x-0" : "translate-x-full"}
          rounded-l-3xl
          pointer-events-auto
        `}
        style={{
          boxShadow: "0 0 32px 0 rgba(255,255,255,0.08), 0 2px 8px 0 rgba(0,0,0,0.12)"
        }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Registro de cliente</h2>
          <button onClick={onClose} className="text-white text-2xl" tabIndex={0}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Campo de identificación */}
          <div className="relative">
            <Input
              label="N° de identificación"
              name="identificacion"
              value={form.identificacion}
              onChange={handleIdInputChange}
              placeholder="Buscar o escribir número de identificación"
              inputClassName={errors.identificacion ? "border-red-500" : ""}
              autoComplete="off"
              onFocus={() => {
                if (searchResults.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {/* Sugerencias */}
            {showSuggestions && (
              <div className="absolute z-20 left-0 right-0 bg-[#232336] border border-[#7c2ae8] rounded-b-xl mt-1 max-h-48 overflow-y-auto shadow-lg">
                {loadingSearch ? (
                  <div className="px-4 py-2 text-gray-400">Buscando...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((cliente) => (
                    <div
                      key={cliente.dni}
                      className="px-4 py-2 hover:bg-[#2d2d44] cursor-pointer text-white"
                      onMouseDown={() => handleSuggestionClick(cliente)}
                    >
                      {cliente.dni} - {cliente.nombre} {cliente.apellido}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400">Sin resultados</div>
                )}
              </div>
            )}
          </div>
          {errors.identificacion && (
            <span className="text-red-400 text-xs">{errors.identificacion}</span>
          )}
          <Input
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del cliente"
            inputClassName={errors.nombre ? "border-red-500" : ""}
          />
          {errors.nombre && (
            <span className="text-red-400 text-xs">{errors.nombre}</span>
          )}
          <Input
            label="Apellido"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            placeholder="Apellido del cliente"
            inputClassName={errors.apellido ? "border-red-500" : ""}
          />
          {errors.apellido && (
            <span className="text-red-400 text-xs">{errors.apellido}</span>
          )}
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo Electrónico"
            inputClassName={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <span className="text-red-400 text-xs">{errors.email}</span>
          )}
          <Input
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Número de teléfono"
            inputClassName={errors.telefono ? "border-red-500" : ""}
          />
          {errors.telefono && (
            <span className="text-red-400 text-xs">{errors.telefono}</span>
          )}
          <Input
            label="Entrada"
            name="entrada"
            type="date"
            value={form.entrada}
            onChange={handleChange}
            inputClassName={errors.entrada ? "border-red-500" : ""}
          />
          {errors.entrada && (
            <span className="text-red-400 text-xs">{errors.entrada}</span>
          )}
          <Input
            label="No. de serie"
            name="serie"
            value={loadingSerie ? "Cargando..." : form.serie}
            onChange={handleChange}
            placeholder="Número de serie"
            inputClassName={errors.serie ? "border-red-500" : ""}
            disabled={loadingSerie}
          />
          {errors.serie && (
            <span className="text-red-400 text-xs">{errors.serie}</span>
          )}
          <div className="mb-4">
            <label className="text-white block mb-1">Comentario:</label>
            <textarea
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              className="w-full rounded-lg p-2 bg-[#232336] text-white"
              rows={3}
              placeholder="Añade una descripción"
            />
            {errors.comentario && (
              <span className="text-red-400 text-xs">{errors.comentario}</span>
            )}
          </div>
          <div className="mb-6">
            <Button
              type="button"
              className="w-full bg-purple-700"
              onClick={() => setShowUploadModal(true)}
            >
              {form.imagen ? "Cambiar imagen" : "+ Añade una imagen"}
            </Button>
            {form.imagen && (
              <div className="mt-2 flex flex-col items-center">
                <img
                  src={form.imagen}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-500 mb-2"
                />
                <span className="text-white block text-sm mb-1">
                  {form.imagen.split("/").pop()}
                </span>
                <Button
                  type="button"
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={handleRemoveImage}
                >
                  Quitar imagen
                </Button>
              </div>
            )}
          </div>
          <Button
            className={`w-full bg-purple-600 ${isSubmitting || Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            onClick={e => {
              if (isSubmitting || Object.keys(errors).length > 0) {
                e.preventDefault();
                showErrorToast("Campos incompletos");
              }
            }}
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </Button>
        </form>
        {showUploadModal && (
          <UploadImageModal
            onClose={() => setShowUploadModal(false)}
            onSave={handleImageSave}
            folder="computadores"
            title="Subir imagen del equipo"
          />
        )}
      </aside>
    </div>
  );
}