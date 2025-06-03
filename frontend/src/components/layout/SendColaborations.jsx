import React, { useState, useEffect } from 'react'
import { showErrorToast, showLoadingToast } from '../common/popUp/Loading';
import toast from 'react-hot-toast';

const SendColaboration = ({ open = false, onClose, userName, projectId }) => { // <-- agrega aquí

  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showModal, setShowModal] = useState(open);

  useEffect(() => {
    setShowModal(open)
  }, [open]);

  const handleClose = () => {
    setShowModal(false)
    setEmail('')
    setMensaje('')
    if (onClose) onClose()
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    const toastId = showLoadingToast("Enviando enlace...");
    try {
      const response = await fetch("http://127.0.0.1:8000/tasks/api/v1/invitacionColaborador/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nombre_invitador: userName, id_proyecto: projectId }),
      });
      const data = await response.json();
      toast.dismiss(toastId);
      if (data.success) {
        setMensaje("¡enlace enviado!");
        setEmail('');
      } else {
        showErrorToast(data.message || "No se pudo enviar el correo");
        setMensaje(data.message);
      }
    } catch (error) {
      toast.dismiss();
      showErrorToast("Error al enviar solicitud. Intenta nuevamente.");
      setMensaje("Error al enviar solicitud. Intenta nuevamente.");
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleClose}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Invitar colaborador</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="w-full border rounded px-3 py-2 mb-3"
                placeholder="Correo del colaborador"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Enviar invitación
              </button>
            </form>
            {mensaje && (
              <p className="text-center text-sm mt-3 text-red-500">{mensaje}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SendColaboration