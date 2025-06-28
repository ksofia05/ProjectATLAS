const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateClientForm(form) {
  const newErrors = {};
  if (!form.identificacion) {
    newErrors.identificacion = "Campo obligatorio";
  } else if (!/^\d+$/.test(form.identificacion)) {
    newErrors.identificacion = "Solo números";
  }
  if (!form.nombre) newErrors.nombre = "Campo obligatorio";
  if (!form.apellido) newErrors.apellido = "Campo obligatorio";
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
  if (!form.comentario) newErrors.comentario = "Campo obligatorio";
  if (!form.imagen) newErrors.imagen = "Debes adjuntar una imagen";
  return newErrors;
}