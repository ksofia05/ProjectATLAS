import React, { useEffect, useRef, useState } from "react";
import RegisterClientForm from "./RegisterClientForm";

export default function RegisterClientDrawer({
  open,
  onClose,
  idproyecto,
  usuarioIdActual,
}) {
  const [mounted, setMounted] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
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

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className={`
          fixed inset-0 transition-all duration-300
          ${
            showDrawer
              ? "backdrop-blur-[2px] bg-black/5 pointer-events-auto"
              : "backdrop-blur-0 bg-transparent pointer-events-none"
          }
        `}
        onClick={onClose}
        aria-label="Cerrar panel"
      />
      <aside
        className={`
          fixed top-0 right-0 h-full w-full max-w-md bg-[#181825] shadow-2xl p-8 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${showDrawer ? "translate-x-0" : "translate-x-full"}
          rounded-l-3xl
          pointer-events-auto
        `}
        style={{
          boxShadow:
            "0 0 32px 0 rgba(255,255,255,0.08), 0 2px 8px 0 rgba(0,0,0,0.12)",
        }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Registro de cliente</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl"
            tabIndex={0}
          >
            &times;
          </button>
        </div>
        {console.log("ID Proyecto en Drawer:", idproyecto)}
        <RegisterClientForm
          onClose={onClose}
          idproyecto={idproyecto}
          usuarioIdActual={usuarioIdActual}
        />
      </aside>
    </div>
  );
}
