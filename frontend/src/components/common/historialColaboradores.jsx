import { client as supabase } from "../../supabase/client";

export async function actualizarHistorialColaborador(id_usuario, id_proyecto, nuevoEstado) {
  // Validación de tipos
  const usuarioId = Number(id_usuario);
  const proyectoId = Number(id_proyecto);

  console.log("Intentando actualizar:", { id_usuario, id_proyecto, nuevoEstado });

  if (isNaN(usuarioId) || isNaN(proyectoId)) {
    console.error("ID de usuario o proyecto inválido:", { usuarioId, proyectoId });
    return;
  }

  const { data, error } = await supabase
    .from("historial_colaboradores")
    .select("id")
    .eq("usuario_id", usuarioId)
    .eq("proyecto_id", proyectoId);

  console.log("Resultado select:", data);

  if (error) {
    console.error("Error al consultar historial_colaboradores:", error);
    return;
  }

  if (data && data.length > 0) {
    // Si existe, actualiza el estado
    const registroId = data[0].id;
    await supabase
      .from("historial_colaboradores")
      .update({ estado: nuevoEstado })
      .eq("id", registroId);
  } else {
    // Si no existe, inserta el registro
    await supabase
      .from("historial_colaboradores")
      .insert([{ usuario_id: usuarioId, proyecto_id: proyectoId, estado: nuevoEstado }]);
  }
}