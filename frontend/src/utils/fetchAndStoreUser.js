import { getUser } from "../services/authService";
import { getUserProfile } from "../services/userService";
import useUserStore from "../stores/useUserStore";

export const fetchAndStoreUser = async () => {
    try {
        const userAuth = await getUser();
        if (!userAuth) return;

        const userProfile = await getUserProfile(userAuth.id);
        useUserStore.getState().setUser(userProfile);
    } catch (error){
        console.error('error en fetchAndStoreUser:', error);
    }
};