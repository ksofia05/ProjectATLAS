import React, { useState, useEffect } from 'react'
import { showErrorToast, showLoadingToast } from '../common/popUp/Loading';
import toast from 'react-hot-toast';
import FloatingModal from '../common/popUp/FloatingModal';

const SendColaboration = ({ open = false, onClose, userName, projectId }) => {
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
        setMensaje("¡Enlace enviado!");
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
        <FloatingModal onClose={handleClose}>
          <div className='flex-1 p-1'>
            <h2 className="text-xl font-bold mb-4 text-white">Compartir Proyecto</h2>
            <p className='text-gray-400 mb-8'>Proyecto: <span className="font-semibold text-white">[Nombre del proyecto]</span></p>
            <form onSubmit={handleSubmit} className='flex gap-2 mb-4'>
              <input
                type="email"
                className="flex-1 border border-gray-700 bg-[#232136] rounded px-3 py-2 text-white placeholder-gray-400"
                placeholder="Correo del colaborador"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                Invitar
              </button>
            </form>
            {mensaje && (
              <p className="text-center font-bold  mt-3 text-purple-400">{mensaje}</p>
            )}

            <h3 className='text-white font-semibold mb-2'>Miembros Actuales</h3>
            <hr className='my-2 border-gray-700' />
            <div className='flex flex-col gap-3 max-h-48 overflow-y-auto'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center rounded-full w-10 h-10 text-lg font-bold bg-purple-400 text-white'>LN</div>
                <div className='flex-1'>
                  <div className='text-white font-medium leading-tight'>Luis Nuñez</div>
                  <div className='text-gray-400 text-xs'>yundaluis4@gmail.com</div>
                </div>
                <span className='px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 text-white'>Administrador</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center rounded-full w-10 h-10 text-lg font-bold bg-purple-700 text-white'>JS</div>
                <div className='flex-1'>
                  <div className='text-white font-medium leading-tight'>Juan Sanchez</div>
                  <div className='text-gray-400 text-xs'>jrvaquero72@gmail.com</div>
                </div>
                <span className='px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-200'>Colaborador</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center rounded-full w-10 h-10 text-lg font-bold bg-green-400 text-white'>VG</div>
                <div className='flex-1'>
                  <div className='text-white font-medium leading-tight'>Valentina Gomez</div>
                  <div className='text-gray-400 text-xs'>valegomita@gmail.com</div>
                </div>
                <span className='px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-200'>Colaborador</span>
              </div>
            </div>
          </div>
        </FloatingModal>
      )}
    </>
  )
}

export default SendColaboration