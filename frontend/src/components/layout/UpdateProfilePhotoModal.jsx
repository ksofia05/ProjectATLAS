import React, { useRef, useState } from "react";
import FloatingModal from "../common/popUp/FloatingModal";
import Button from "../common/Button";
import { client as supabase } from "../../supabase/client"; // Ajusta la ruta si es necesario

const UpdateProfilePhotoModal = ({ onClose, onSave, user }) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  console.log("USER:", user);
  // ...existing code...
const fileExt = file.name.split('.').pop();
const filePath = `fotosPerfiles/perfil_${user.id}_${Date.now()}.${fileExt}`;

// 1. Subir archivo al bucket usando filePath
const { data, error } = await supabase.storage
  .from("atlas")
  .upload(filePath, file, { upsert: true });

console.log("UPLOAD DATA:", data);
console.log("UPLOAD ERROR:", error);

if (error) {
  alert("Error al subir la imagen: " + error.message);
  setUploading(false);
  return;
}

// 2. Obtener la URL pública usando filePath
const { data: publicUrlData } = supabase
  .storage
  .from("atlas")
  .getPublicUrl(filePath);

const publicUrl = publicUrlData.publicUrl;

// ...resto igual...
// ...existing code...

    // 3. Actualizar el perfil del usuario en Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      data: { fotosPerfiles: publicUrl }
    });

    setUploading(false);

    if (updateError) {
      alert("Error al actualizar el perfil");
      return;
    }

    if (onSave) onSave(publicUrl);
    onClose();
  };
  const [dragActive, setDragActive] = useState(false);

const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(true);
};

const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
};

const handleDrop = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    await handleFileChange({ target: { files: e.dataTransfer.files } });
  }
};

  return (
    <FloatingModal onClose={onClose}>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        Actualizar foto de perfil
      </h2>
      <hr className="border-t border-gray-700 mb-4" />
      <div className="flex flex-col items-center">
        <span className="text-[#7c2ae8] mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-camera-fill" viewBox="0 0 16 16">
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
          </svg>
        </span>
        <p className="text-white mb-2">¡Sube una imagen nueva!</p>
        
      <div
      className={`border-2 border-dashed rounded-lg w-full py-8 flex flex-col items-center mb-4 ${dragActive ? "border-purple-500 bg-purple-900/10" : "border-gray-500"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
          <p className="text-gray-400">Arrastra archivos aquí</p>
          <span className="text-gray-400 text-2xl">O</span>
          <Button
            className="mt-2 bg-gray-700 hover:bg-gray-600 max-w-xs"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
          >
            {uploading ? "Subiendo..." : "Examinar archivos"}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex gap-4 w-full mt-4">
          <Button className="bg-gray-700 hover:bg-gray-600" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </FloatingModal>
  );
};

export default UpdateProfilePhotoModal;