import React, { useState, useEffect, useRef } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { showSuccessToast, showErrorToast } from "../common/popUp/Loading";
import UploadImageModal from "../layout/uploadImageModal";// Importa el modal reutilizable

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

export default function RegisterClientDrawer({ open, onClose }) {
  const [form, setForm] = useState({
    identificacion: "",
    nombre: "",
    email: "",
    telefono: "",
    entrada: getToday(), // por defecto tendra la fecha de hoy (anny me confundio :b) grosero le dije que eso se hacia en la bd de datos no en el front enojo, furia
    serie: "",
    comentario: "",
    imagen: null, // Aquí se guardará la URL pública de la imagen subida
  });

  const [mounted, setMounted] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ignoreNextFocus, setIgnoreNextFocus] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false); // Controla el modal
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.identificacion || !form.nombre || !form.email) {
      showErrorToast("Completa los campos obligatorios");
      return;
    }
    showSuccessToast("Equipo registrado correctamente");
    onClose();
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
              className="w-full rounded-lg p-2 bg-[#232336] text-white outline-none"
              placeholder="Buscar o escribir número de identificación"
              value={form.identificacion}
              onChange={handleChange}
              onFocus={handleIdFocus}
              autoComplete="off"
            />
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
          />
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo Electrónico"
          />
          <Input
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Número de teléfono"
          />
          <Input
            label="Entrada"
            name="entrada"
            type="date"
            value={form.entrada}
            onChange={handleChange}
          />
          <Input
            label="No. de serie"
            name="serie"
            value={form.serie}
            onChange={handleChange}
            placeholder="Número de serie"
          />
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
            folder="computadores" // Aquí cambias el folder al bucket de computadores
            title="Subir imagen del equipo"
          />
        )}
      </aside>
    </div>
  );
}