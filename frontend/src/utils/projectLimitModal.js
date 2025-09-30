export const PROJECT_LIMIT_TTL_MS = 2 * 60 * 1000; // 2 min para evitar flags huérfanos

export const triggerProjectLimit = (message, email) => {
  try {
    const msg =
      message ||
      "Actualmente ya formas parte de un proyecto. Si deseas unirte a este, primero elimina tu proyecto actual y vuelve a aceptar la invitación.";
    const who = (email || "").toLowerCase();
    const ts = Date.now();
    localStorage.setItem("showProjectLimitModal", "1");
    localStorage.setItem("projectLimitMessage", msg);
    localStorage.setItem("projectLimitWho", who);
    localStorage.setItem("projectLimitTs", String(ts));
    window.dispatchEvent(
      new CustomEvent("projectLimitViolation", { detail: { message: msg, email: who, ts } })
    );
  } catch {}
};

export const clearProjectLimitFlags = () => {
  try {
    localStorage.removeItem("showProjectLimitModal");
    localStorage.removeItem("projectLimitMessage");
    localStorage.removeItem("projectLimitWho");
    localStorage.removeItem("projectLimitTs");
  } catch {}
};