import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
    persist(
        (set) => ({
        user: null,
        
        setUser: (user) => {
            console.log('📝 Guardando usuario en store:', user?.nombre || 'null');
            set({ user });
        },
        clearUser: () => {
            console.log('🗑️ Limpiando usuario del store');
            set({ user: null });
        },
        }),
        {
        name: 'user-storage',
        getStorage: () => localStorage,
        }
    )
);

export default useUserStore;