import React from "react";
import SidebarProfile from "../../components/layout/SidebarProfile";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../hooks/useAuth";
import { useProfileLogic } from "../../hooks/useProfileLogic";
import UpdateProfilePhotoModal from "../../components/layout/UpdateProfilePhotoModal";
import CancelProfileConfigModal from "./CancelProfileConfigModal";
import PersonalInfoCard from "../../components/profile/PersonalInfoCard";
import SecurityCard from "../../components/profile/SecurityCard";
import BackButton from "../../components/common/BackButton";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPhotoModal,
    setShowPhotoModal,
    showCancelModal,
    setShowCancelModal,
    canSave,
    handlePasswordUpdate,
    handleDisabledClick,
    handleBackClick,
    navigate,
  } = useProfileLogic();

  if (isLoading) {
    return <div className="text-white text-center mt-10">Cargando...</div>;
  }

  const nombres = user?.user_metadata?.nombre || "";
  const apellidos = user?.user_metadata?.apellido || "";
  const correo = user?.email || user?.user_metadata?.email || "";

  return (
    <div className="min-h-screen bg-black flex">
      <SidebarProfile onPhotoClick={() => setShowPhotoModal(true)} />
      <div className="flex-1 flex flex-col" style={{ marginLeft: 300 }}>
        <div className="max-w-[1200px] mx-auto w-full px-8">
          {/* Navbar */}
          <div className="pt-6">
            <Navbar
              backButton={<BackButton onClick={handleBackClick} />}
              hideUserMenu={true}
              title="Mi perfil"
              subtitle="Gestiona tu información personal y seguridad"
            />
          </div>
          {/* Tarjetas */}
          <main className="flex-1 flex flex-col mt-6 w-full">
            <PersonalInfoCard
              nombres={nombres}
              apellidos={apellidos}
              correo={correo}
            />
            <SecurityCard
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              canSave={canSave}
              onPasswordUpdate={handlePasswordUpdate}
              onDisabledClick={handleDisabledClick}
            />
          </main>
        </div>
      </div>
      {showPhotoModal && (
        <UpdateProfilePhotoModal
          onClose={() => setShowPhotoModal(false)}
          onSave={() => setShowPhotoModal(false)}
          user={user}
        />
      )}
      {showCancelModal && (
        <CancelProfileConfigModal
          onClose={() => setShowCancelModal(false)}
          onSave={() => {
            setShowCancelModal(false);
            navigate(-1);
          }}
        />
      )}
    </div>
  );
}
