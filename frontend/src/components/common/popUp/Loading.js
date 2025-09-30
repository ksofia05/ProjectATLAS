import toast from "react-hot-toast";

// Toast de carga (devuelve el id para cerrarlo después)
export const showLoadingToast = (mensaje = "Cargando...") =>
  toast.loading(mensaje, {
    style: {
      borderRadius: "10px",
      background: "#18162b",
      color: "#fff",
      fontWeight: "bold",
      zIndex: 99999,
    },
    iconTheme: {
      primary: "#a78bfa",
      secondary: "#fff",
    },
  });

// Toast de éxito
export const showSuccessToast = (mensaje) =>
  toast.success(mensaje, {
    style: {
      borderRadius: "10px",
      background: "#18162b",
      color: "#fff",
      fontWeight: "bold",
      zIndex: 99999,
    },
    iconTheme: {
      primary: "#a78bfa",
      secondary: "#fff",
    },
  });

// Toast de error
export const showErrorToast = (mensaje) =>
  toast.error(mensaje, {
    style: {
      borderRadius: "10px",
      background: "#18162b",
      color: "#fff",
      fontWeight: "bold",
      zIndex: 99999, 
    },
    iconTheme: {
      primary: "#f87171",
      secondary: "#fff",
    },
  });
