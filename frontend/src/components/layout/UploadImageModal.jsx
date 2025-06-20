import React, { useRef, useState } from "react";
import FloatingModal from "../common/popUp/FloatingModal";
import Button from "../common/Button";
import { client as supabase } from "../../supabase/client";
import ReactDOM from "react-dom";

const UploadImageModal = ({
  onClose,
  onSave,
  folder = "fotosPerfiles",
  user = null,
  title = "Subir imagen",
  updateProfile = false,
  initialFileName = null,
}) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Archivo no compatible: usa JPEG, PNG o JPG (max 5MB)");
      return false;
    }
    if (file.size > maxSize) {
      setErrorMsg("El archivo es demasiado grande (max 5MB)");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateImage(file)) return;
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!validateImage(file)) return;
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!selectedImage) return;
    setUploading(true);

    const file = selectedImage;
    const fileExt = file.name.split('.').pop();
    let fileName = initialFileName;
    if (!fileName) {
      fileName = user
        ? `perfil_${user.id}_${Date.now()}.${fileExt}`
        : `img_${Date.now()}.${fileExt}`;
    }
    const filePath = `${folder}/${fileName}`;

    // 1. Subir archivo al bucket usando filePath
    const { error } = await supabase.storage
      .from("atlas")
      .upload(filePath, file, { upsert: true });

    if (error) {
      setErrorMsg("Error al subir la imagen: " + error.message);
      setUploading(false);
      return;
    }

    // 2. Obtener la URL pública usando filePath
    const { data: publicUrlData } = supabase
      .storage
      .from("atlas")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Si es para perfil, actualizar el perfil del usuario en Supabase Auth
    if (updateProfile && user) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { fotosPerfiles: publicUrl }
      });
      if (updateError) {
        setErrorMsg("Error al actualizar el perfil");
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    if (onSave) onSave(publicUrl);
    onClose();
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (onClose) onClose();
  };

  return ReactDOM.createPortal (
    
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
    <FloatingModal onClose={onClose}>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        {title}
      </h2>
      <hr className="border-t border-gray-700 mb-4" />
      <div className="flex flex-col items-center ">
        <span className="text-[#7c2ae8] mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-image-fill" viewBox="0 0 16 16">
            <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
          </svg>
        </span>
        <p className="text-white mb-2">¡Sube una imagen nueva!</p>
        {errorMsg && (
          <div className="text-red-500 mb-2">{errorMsg}</div>
        )}
        <div
          className={`border-2 border-dashed rounded-lg w-full py-8 flex flex-col items-center mb-4 ${dragActive ? "border-purple-500 bg-purple-900/10" : "border-gray-500"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-purple-500"
            />
          ) : (
            <>
              <p className="text-gray-400">Arrastra archivos aquí</p>
              <span className="text-gray-400 text-2xl">O</span>
            </>
          )}
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
          <Button className="bg-gray-700 hover:bg-gray-600 flex-1" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            className="bg-[#7c2ae8] hover:bg-[#5a1bb7] flex-1"
            onClick={handleSave}
            disabled={!selectedImage || uploading}
          >
            Guardar
          </Button>
        </div>
      </div>
    </FloatingModal>
    </div>,
    document.body
    

  );
};

export default UploadImageModal;