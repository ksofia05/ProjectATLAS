import React from "react";
import SidebarProfile from "../../components/layout/SidebarProfile";
import { useAuth } from "../../hooks/useAuth";
import { useProfileLogic } from "../../hooks/useProfileLogic";
import UpdateProfilePhotoModal from "../../components/layout/UpdateProfilePhotoModal";
import CancelProfileConfigModal from "./CancelProfileConfigModal";

// Componentes mejor optimizados xd
import ProfileBackgroundEffects from "../../components/profile/ProfileBackgroundEffects";
import ProfileHeader from "../../components/profile/ProfileHeader";
import PersonalInfoCard from "../../components/profile/PersonalInfoCard";
import SecurityCard from "../../components/profile/SecurityCard";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-zinc-950 to-slate-900 relative">
      <ProfileBackgroundEffects />

      <SidebarProfile onPhotoClick={() => setShowPhotoModal(true)} />

      <div className="ml-80 flex flex-col min-h-screen relative z-10">
        <main className="flex-1 flex flex-col py-6 px-6">
          <ProfileHeader onBackClick={handleBackClick} />

          <div className="w-full max-w-8xl flex flex-col md:flex-row gap-12">
            <section className="flex-1">
              <hr className="border-gray-700 mb-12" />
              <div className="max-w-5xl w-full mx-auto space-y-6">
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
              </div>
            </section>
          </div>
        </main>
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
