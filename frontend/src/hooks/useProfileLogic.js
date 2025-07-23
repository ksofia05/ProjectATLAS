import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/common/popUp/Loading";
import { client } from "../supabase/client";

function isPasswordValid(password) {
  const lengthValid = password.length >= 8;
  const upperCase = /[A-Z]/.test(password);
  const lowerCase = /[a-z]/.test(password);
  const number = /[0-9]/.test(password);
  const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return lengthValid && upperCase && lowerCase && number && special;
}

export const useProfileLogic = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const passwordValid = isPasswordValid(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSave = passwordValid && passwordsMatch;

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!canSave) {
      showErrorToast(
        !passwordValid
          ? "La contraseña no cumple con los requisitos"
          : "Las contraseñas no coinciden"
      );
      return;
    }
    const { error } = await client.auth.updateUser({ password });
    if (error) {
      showErrorToast("Error al actualizar la contraseña: " + error.message);
    } else {
      showSuccessToast("Contraseña actualizada correctamente");
      setPassword("");
      setConfirmPassword("");
      setIsSaved(true);
    }
  };

  const handleDisabledClick = (e) => {
    e.preventDefault();
    showErrorToast(
      !passwordValid
        ? "La contraseña no cumple con los requisitos"
        : "Las contraseñas no coinciden"
    );
  };

  const handleBackClick = () => {
    if ((password !== "" || confirmPassword !== "") && !isSaved) {
      setShowCancelModal(true);
    } else {
      navigate(-1);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPhotoModal,
    setShowPhotoModal,
    showCancelModal,
    setShowCancelModal,
    isSaved,
    canSave,
    handlePasswordUpdate,
    handleDisabledClick,
    handleBackClick,
    navigate,
  };
};
