import axios from "axios";
import { showErrorToast } from "../components/common/popUp/Loading";
import toast from "react-hot-toast";

export async function openDashboardIfActive(id_proyecto, user, toastId) {
  const id_usuario = user?.idUsuario || user?.idusuario;
  if (!id_usuario) {
    if (toastId) toast.dismiss(toastId);
    showErrorToast("No se pudo validar tu usuario.");
    return;
  }
  try {
    const res = await axios.get(
      `http://localhost:8000/tasks/api/v1/estado_colaborador_proyecto/?id_usuario=${id_usuario}&id_proyecto=${id_proyecto}`
    );
    if (res.data.estado !== "Activo") {
      if (toastId) toast.dismiss(toastId);
      showErrorToast("No puedes ingresar a este proyecto porque estás inactivo.");
      return;
    }
  
    if (toastId) toast.dismiss(toastId);
    setTimeout(() => {
      window.open(`/dashboard/${id_proyecto}`, "_blank");
    }, 100); 
  } catch (err) {
    if (toastId) toast.dismiss(toastId);
    showErrorToast("No se pudo validar tu estado. Intenta de nuevo.");
  }
}