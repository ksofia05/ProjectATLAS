import React, { useState, useEffect } from 'react'
import { showErrorToast, showLoadingToast } from '../common/popUp/Loading';
import toast from 'react-hot-toast';
import FloatingModal from '../common/popUp/FloatingModal';

const SendColaboration = ({ open = false, onClose, userName, projectId }) => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showModal, setShowModal] = useState(open);
  const [projectName, setProjectName]=useState('');
  const [collaborators, setCollaborators]=useState([]);

const fechProjectInfo = async () => {
  if (!projectId) return;
    try{
      const res = await fetch(`http://localhost:8000/tasks/api/v1/info_proyecto_colaboradores/?id_proyecto=${projectId}`);
      const data = await res.json();
      setProjectName(data.nombreproyecto || "");
      setCollaborators(data.colaboradores || []);
    } catch{
      setProjectName("");
      setCollaborators([]);
      }
    };
    useEffect(()=> {
      setShowModal(open);
      if (open) fechProjectInfo();
    },[open, projectId]);

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
        fechProjectInfo();
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
          {({ handleClose }) => (
            <div className='flex-1 p-1'>
              <h2 className='text-x1 font-bold mb-4 text-white'>Compartir Proyecto</h2>
              <p className='text-gray-400 mb-8'>
                Proyecto: <span className='font-semibold text-white'>{projectName || "[Nombre del proyecto]"}</span>
              </p>
              <form onSubmit={handleSubmit} className='flex gap-2 mb-4'>
                <input 
                  type="email" 
                  className='flex-1 border border-gray-700 bg-[#232136] rounded px-3 py-2 text-white placeholder-gray-400'
                  placeholder="Correo del colaborador"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type='submit'
                  className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition'
                >
                  Invitar
                </button>
              </form>
              <h3 className='text-white font-semibold mb-2'>Miembros Actuales</h3>
              <hr  className='my-2 border-gray-700' />
              <div className='flex flex-col gap-3 max-h-48 overflow-y-auto'>
                {collaborators.length === 0 && (
                  <div className='text-gray-400 text-center'>Sin colaboradores aún</div>
                )}
                {collaborators.map((colab, idx)=>(
                  <div className='flex items-center gap-3' key={colab.correo || idx }>
                    <div className='flex items-center justify-center rounded-full w-10 h-10 text-lg font-bold bg-purple-400 text-white'>
                      {colab.nombre?.charAt(0)}{colab.apellido?.charAt(0)}
                    </div>
                    <div className='flex-1'>
                      <div className='text-white font-medium leading-tight'>{colab.nombre} {colab.apellido}</div>
                      <div className='text-gray-400 text-xs'>{colab.correo}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      colab.rol === "Administrador"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}>
                      {colab.rol}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FloatingModal>
      )}
    </>
  )
}

export default SendColaboration