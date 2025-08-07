import React, { useState, useEffect } from "react";
import ClientPersonalInfoFields from "./ClientPersonalInfoFields";
import ClientEquipmentFields from "./ClientEquipmentFields";
import ImageUploader from "./ImageUploader";
import Button from "../common/Button";
import UploadImageModal from "../layout/uploadImageModal";
import { showSuccessToast, showErrorToast } from "../common/popUp/Loading";
import { client as supabase } from "../../supabase/client";
import { validateClientForm } from "../../utils/validateClientForm";
import { useClientAutocomplete } from "../../hooks/useClientAutocomplete";
import { dateUtils } from "../../utils/dateUtils";

export default function RegisterClientForm({
  onClose,
  idproyecto,
  usuarioIdActual,
}) {
  const [form, setForm] = useState({
    identificacion: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    entrada: dateUtils.getToday(), // ✅ Usar dateUtils
    serie: "",
    comentario: "",
    imagen: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSerie, setLoadingSerie] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [seriesSugeridas, setSeriesSugeridas] = useState([]);

  // (tengo unos problemas con los errores, no se marcan bien :b)
  const [touched, setTouched] = useState({});
  const [triedSubmit, setTriedSubmit] = useState(false);

  // Con esto se maneja la búsqueda de clientes
  const {
    searchResults,
    showSuggestions,
    loadingSearch,
    setShowSuggestions,
    handleIdInputChange,
    setSearchResults,
  } = useClientAutocomplete(handleChange, idproyecto);

  // Se valida el formulario al cargar
  useEffect(() => {
    setErrors(validateClientForm(form));
  }, []);

  useEffect(() => {
    console.log("ID Proyecto en RegisterClientForm:", idproyecto);
  }, [idproyecto]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => {
      const newForm = { ...form, [name]: value };
      return validateClientForm(newForm);
    });
  }

  // Al seleccionar sugerencia
  const handleSuggestionClick = async (cliente) => {
    setForm((prev) => ({
      ...prev,
      identificacion: cliente.dni,
      nombre: cliente.nombre || "",
      apellido: cliente.apellido || "",
      email: cliente.correo || "",
      telefono: cliente.telefono || "",
      // serie: "", // No autocompletes aquí
    }));
    setShowSuggestions(false);

    setLoadingSerie(true);

    // Buscar todos los agendamientos del cliente
    const { data: agendamientos } = await supabase
      .from("Agendamiento")
      .select("idAgendamiento")
      .eq("Cliente_dni", cliente.dni);

    if (!agendamientos || agendamientos.length === 0) {
      setSeriesSugeridas([]);
      setLoadingSerie(false);
      return;
    }

    const idsAgendamiento = agendamientos.map((a) => a.idAgendamiento);

    // Buscar todos los EquipoAgendamiento relacionados
    const { data: equipoAgs } = await supabase
      .from("EquipoAgendamiento")
      .select("equipo_numeroSerie")
      .in("agendamiento_idAgendamiento", idsAgendamiento);

    // Extraer y filtrar los números de serie únicos
    const series = equipoAgs
      ? [...new Set(equipoAgs.map((ea) => ea.equipo_numeroSerie))]
      : [];

    setSeriesSugeridas(series);
    setLoadingSerie(false);
  };

  // Imagen
  const handleImageSave = (publicUrl) => {
    setForm((prev) => {
      const newForm = { ...prev, imagen: publicUrl };
      setErrors(validateClientForm(newForm));
      return newForm;
    });
    setShowUploadModal(false);
  };

  const handleRemoveImage = () => {
    setForm((prev) => {
      const newForm = { ...prev, imagen: null };
      setErrors(validateClientForm(newForm));
      return newForm;
    });
  };

  const handleSubmit = async (e) => {
e.preventDefault();
  setTriedSubmit(true);
  const validationErrors = validateClientForm(form);
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  setIsSubmitting(true);
  try {
    // 1. Buscar si el cliente ya existe
    const { data: existingCliente } = await supabase
      .from("Cliente")
      .select("*")
      .eq("dni", form.identificacion)
      .single();

    let clienteData;
    let clienteError;

    if (existingCliente) {
      // 2. Si existe, ACTUALIZA los datos
      const { data, error } = await supabase
        .from("Cliente")
        .update({
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.email,
          telefono: form.telefono,
          // ...otros campos si tienes
        })
        .eq("dni", form.identificacion)
        .select()
        .single();
      clienteData = data;
      clienteError = error;
    } else {
      // 3. Si no existe, lo insertas (como ya tienes)
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
      const { data: existingEquipo } = await supabase
        .from("Equipo")
        .select("*")
        .eq("numeroSerie", form.serie)
        .maybeSingle();

      if (existingEquipo) {
        // Si la imagen es diferente, actualizarla (guardar la URL pública completa)
        if (form.imagen && existingEquipo.fotoEquipo !== form.imagen) {
          let nuevaFotoEquipo = form.imagen;
          if (!form.imagen.startsWith("http")) {
            nuevaFotoEquipo = `https://ksofia05-org.supabase.co/storage/v1/object/public/atlas/computadores/${form.imagen}`;
          }
          const { error: updateError, data: updatedEquipo } = await supabase
            .from("Equipo")
            .update({ fotoEquipo: nuevaFotoEquipo })
            .eq("numeroSerie", form.serie)
            .select()
            .maybeSingle();
          equipoData = updatedEquipo || existingEquipo;
          equipoError = updateError;
        } else {
          equipoData = existingEquipo;
        }
      } else {
        // Guardar la URL pública completa si es posible
        let nuevaFotoEquipo = form.imagen;
        if (form.imagen && !form.imagen.startsWith("http")) {
          nuevaFotoEquipo = `https://ksofia05-org.supabase.co/storage/v1/object/public/atlas/computadores/${form.imagen}`;
        }
        const insertEquipo = await supabase
          .from("Equipo")
          .insert([
            {
              numeroSerie: form.serie,
              marca: "",
              fotoEquipo: nuevaFotoEquipo,
            },
          ])
          .select()
          .maybeSingle();
        equipoData = insertEquipo.data;
        equipoError = insertEquipo.error;
      }

      if (equipoError) throw equipoError;

      // 3. Insertar agendamiento
      const { data: agendamientoData, error: agendamientoError } =
        await supabase
          .from("Agendamiento")
          .insert([
            {
              Cliente_dni: clienteData.dni,
              Usuario_id: usuarioIdActual,
            },
          ])
          .select()
          .maybeSingle();

      if (agendamientoError) throw agendamientoError;

      //4. aqui se inserta el equipoAgendamiento (se relacionan)
      const { error: equipoAgendamientoError } = await supabase
        .from("EquipoAgendamiento")
        .insert([
          {
            fechaIngreso: form.entrada,
            comentarioEntrada: form.comentario,
            Estado: "Activo",
            equipo_numeroSerie: equipoData.numeroSerie,
            agendamiento_idAgendamiento: agendamientoData.idAgendamiento,
            comentarioSalida: "", // Si tienes un campo para comentario de salida
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

  return (
    <form onSubmit={handleSubmit}>
      <ClientPersonalInfoFields
        form={form}
        errors={errors}
        touched={touched}
        triedSubmit={triedSubmit}
        searchResults={searchResults}
        showSuggestions={showSuggestions}
        loadingSearch={loadingSearch}
        handleIdInputChange={handleIdInputChange}
        handleSuggestionClick={handleSuggestionClick}
        handleChange={handleChange}
        setShowSuggestions={setShowSuggestions}
        setTouched={setTouched}
        seriesSugeridas={seriesSugeridas}
      />

      <ClientEquipmentFields
        form={form}
        errors={errors}
        loadingSerie={loadingSerie}
        handleChange={handleChange}
        touched={touched}
        triedSubmit={triedSubmit}
        setTouched={setTouched}
        seriesSugeridas={seriesSugeridas}
      />

      <ImageUploader
        imagen={form.imagen}
        onUploadClick={() => setShowUploadModal(true)}
        onRemove={handleRemoveImage}
      />
      {(touched.imagen || triedSubmit) && errors.imagen && (
        <span className="text-red-400 text-xs">{errors.imagen}</span>
      )}

      <Button
        className={`w-full bg-purple-600 ${
          isSubmitting || Object.keys(errors).length > 0
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        type="submit"
        disabled={isSubmitting || Object.keys(errors).length > 0}
        onClick={(e) => {
          if (isSubmitting || Object.keys(errors).length > 0) {
            e.preventDefault();
            showErrorToast("Campos incompletos");
          }
        }}
      >
        {isSubmitting ? "Registrando..." : "Registrar"}
      </Button>

      {showUploadModal && (
        <UploadImageModal
          onClose={() => setShowUploadModal(false)}
          onSave={handleImageSave}
          folder="computadores"
          title="Subir imagen del equipo"
        />
      )}
    </form>
  );
}
