const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateClientForm(form) {
  const newErrors = {};
  if (!form.identificacion) {
    newErrors.identificacion = "El campo es obligatorio";
  } else if (!/^\d+$/.test(form.identificacion)) {
    newErrors.identificacion = "Solo se permiten números";
  } else if (form.identificacion.length > 10) {
    newErrors.identificacion = "Máximo 10 dígitos";
  }
  if (!form.nombre) {
    newErrors.nombre = "El campo es obligatorio";
  } else if (/\d/.test(form.nombre)) {
    newErrors.nombre = "El nombre no puede contener números";
  }
  if (!form.apellido) {
    newErrors.apellido = "El campo es obligatorio";
  } else if (/\d/.test(form.apellido)) {
    newErrors.apellido = "El apellido no puede contener números";
  }
  if (!form.serie) newErrors.serie = "El campo es obligatorio";
  if (!form.comentario) newErrors.comentario = "El campo es obligatorio";
  if (!form.email) {
    newErrors.email = "El campo es obligatorio";
  } else if (!emailRegex.test(form.email)) {
    newErrors.email = "debe cumplir con el formato ";
  }
  if (!form.telefono) {
    newErrors.telefono = "El campo es obligatorio";
  } else if (!/^\d+$/.test(form.telefono)) {
    newErrors.telefono = "Solo se permiten números";
  } else if (form.telefono.length < 10) {
    newErrors.telefono = "Debe tener al menos 10 dígitos";
  }
  return newErrors;
}