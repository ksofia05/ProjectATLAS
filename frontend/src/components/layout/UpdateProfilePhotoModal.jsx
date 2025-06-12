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

  return (
    <FloatingModal onClose={onClose}>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        Actualizar foto de perfil
      </h2>
      <hr className="border-t border-gray-700 mb-4" />
      <div className="flex flex-col items-center">
        <span className="text-[#7c2ae8] mb-2">
          <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17a4 4 0 100-8 4 4 0 000 8zm8-10h-3.17l-1.84-2.58A2 2 0 0012.89 3h-1.78a2 2 0 00-1.6.82L7.17 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"></path>
          </svg>
        </span>
        <p className="text-white mb-2">¡Sube una imagen nueva!</p>
        <div className="border-2 border-dashed border-gray-500 rounded-lg w-full py-8 flex flex-col items-center mb-4">
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