import React from "react";
import Button from "../common/Button";

export default function ImageUploader({ imagen, onUploadClick, onRemove }) {
  return (
    <div className="mb-6">
      <Button
        type="button"
        className="w-full bg-purple-700"
        onClick={onUploadClick}
      >
        {imagen ? "Cambiar imagen" : "+ Añade una imagen"}
      </Button>
      {imagen && (
        <div className="mt-2 flex flex-col items-center">
          <img
            src={imagen}
            alt="Vista previa"
            className="w-32 h-32 object-cover rounded-lg border border-gray-500 mb-2"
          />
          <span className="text-white block text-sm mb-1">
            {imagen.split("/").pop()}
          </span>
          <Button
            type="button"
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={onRemove}
          >
            Quitar imagen
          </Button>
        </div>
      )}
    </div>
  );
}