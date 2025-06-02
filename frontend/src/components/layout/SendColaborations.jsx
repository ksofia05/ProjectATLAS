import React, { useState, useEffect } from 'react'

const SendColaboration = ({ open = false, onClose }) => {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [showModal, setShowModal] = useState(open)

  useEffect(() => {
    setShowModal(open)
  }, [open])

  const enviarInvitacion = async () => {
    try {
      const res = await fetch('http://localhost:8000/tasks/api/invitar/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setMensaje('✅ Invitación enviada correctamente')
      } else {
        setMensaje('❌ Error: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      setMensaje('❌ Error al conectar con el servidor')
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setEmail('')
    setMensaje('')
    if (onClose) onClose()
  }

  return (
    <>
      {showModal && (
        <div className="min-h-screen fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <h1 className="text-2xl font-bold mb-4 text-black text-center">
              Invitar Colaborador
            </h1>

            <input
              type="email"
              placeholder="Correo del colaborador"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4 text-black"
            />

            <button
              onClick={enviarInvitacion}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Enviar Invitación
            </button>

            {mensaje && (
              <p className="mt-4 text-center text-sm text-gray-700">{mensaje}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SendColaboration