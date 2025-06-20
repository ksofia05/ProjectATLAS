import React, { useState, useEffect, useRef } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { showSuccessToast, showErrorToast } from "../common/popUp/Loading";
import UploadImageModal from "../layout/uploadImageModal";
import { client as supabase } from "../../supabase/client";

// Simulación de clientes registrados
const CLIENTES = [
  {
    identificacion: "1107976737",
    nombre: "Jose Jacobo",
    email: "jose@email.com",
    telefono: "3001234567",
    serie: "SN1234-5678-9101",
  },
  {
    identificacion: "1107977786",
    nombre: "Dilan Francisco",
    email: "dilan@email.com",
    telefono: "3009876543",
    serie: "CP-2024-ABCD-1234-EFGH",
  },
  {
    identificacion: "1107979999",
    nombre: "Daniel Orlando",
    email: "daniel@email.com",
    telefono: "3012345678",
    serie: "TV2024-XYZ-0001",
  },
];

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
    email: "",
    telefono: "",
    entrada: getToday(),
    serie: "",
    comentario: "",
    imagen: null,
  });

  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ignoreNextFocus, setIgnoreNextFocus] = useState(false);
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

  useEffect(() => {
    if (form.identificacion.length > 0) {
      const filtrados = CLIENTES.filter(c =>
        c.identificacion.includes(form.identificacion)
      );
      setSugerencias(filtrados);
      setShowDropdown(filtrados.length > 0);
    } else {
      setSugerencias([]);
      setShowDropdown(false);
    }
    if (!CLIENTES.some(c => c.identificacion === form.identificacion)) {
      setForm(f => ({
        ...f,
        nombre: "",
        email: "",
        telefono: "",
        serie: "",
      }));
    }
  }, [form.identificacion]);

  const handleSelectCliente = (cliente) => {
    setForm(f => ({
      ...f,
      identificacion: cliente.identificacion,
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      serie: cliente.serie || "",
    }));
    setShowDropdown(false);
    setIgnoreNextFocus(true);
    if (inputIdRef.current) {
      inputIdRef.current.blur();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIdFocus = () => {
    if (ignoreNextFocus) {
      setIgnoreNextFocus(false);
      return;
    }
    if (sugerencias.length > 0) setShowDropdown(true);
  };

  // Cuando se guarda la imagen desde el modal
  const handleImageSave = (publicUrl) => {
    setForm(prev => ({
      ...prev,
      imagen: publicUrl,
    }));
    setShowUploadModal(false);
  };

  const handleRemoveImage = () => {
    setForm(prev => ({
      ...prev,
      imagen: null,
    }));
  };

  // Validación de campos
  const validate = () => {
    const newErrors = {};
    if (!form.identificacion) {
      newErrors.identificacion = "Campo obligatorio";
    } else if (!/^\d+$/.test(form.identificacion)) {
      newErrors.identificacion = "Solo números";
    }
    if (!form.nombre) newErrors.nombre = "Campo obligatorio";
    if (!form.email) {
      newErrors.email = "Campo obligatorio";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Correo inválido";
    }
    if (!form.telefono) {
      newErrors.telefono = "Campo obligatorio";
    } else if (!/^\d+$/.test(form.telefono)) {
      newErrors.telefono = "Solo números";
    }
    if (!form.entrada) newErrors.entrada = "Campo obligatorio";
    if (!form.serie) newErrors.serie = "Campo obligatorio";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

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
              apellido: "",
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
              // agrega más campos si tu modelo lo requiere
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

      // 4. Insertar en EquipoAgendamiento
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

      showSuccessToast("Registro realizado con éxito");
      onClose();
    } catch (err) {
      console.error("Error al registrar cliente/equipo:", err);
      if (err && err.message) {
        showErrorToast(err.message);
      } else {
        showErrorToast("Error al registrar cliente/equipo");
      }
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
          {/* Campo de identificación con autocompletado */}
          <div className="mb-4 relative">
            <label className="text-white block mb-1 font-semibold">N° de identificación</label>
            <input
              type="text"
              ref={inputIdRef}
              name="identificacion"
              className={`w-full rounded-lg p-2 bg-[#232336] text-white outline-none border ${errors.identificacion ? "border-red-500" : "border-[#232336]"}`}
              placeholder="Buscar o escribir número de identificación"
              value={form.identificacion}
              onChange={handleChange}
              onFocus={handleIdFocus}
              autoComplete="off"
            />
            {errors.identificacion && (
              <span className="text-red-400 text-xs">{errors.identificacion}</span>
            )}
            {showDropdown && (
              <ul className="absolute left-0 right-0 bg-[#232336] border border-[#232336] rounded-lg mt-1 z-10 max-h-40 overflow-y-auto">
                {sugerencias.map(cliente => (
                  <li
                    key={cliente.identificacion}
                    className="p-2 hover:bg-[#181825] cursor-pointer text-white"
                    onMouseDown={() => handleSelectCliente(cliente)}
                  >
                    {cliente.identificacion} - {cliente.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Input
            label="Nombre de usuario"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre de identificación"
            inputClassName={errors.nombre ? "border-red-500" : ""}
          />
          {errors.nombre && (
            <span className="text-red-400 text-xs">{errors.nombre}</span>
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
            value={form.serie}
            onChange={handleChange}
            placeholder="Número de serie"
            inputClassName={errors.serie ? "border-red-500" : ""}
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
          <Button className="w-full bg-purple-600" type="submit">
            Registrar
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