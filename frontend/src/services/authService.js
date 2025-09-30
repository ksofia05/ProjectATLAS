import { client as supabase } from "../supabase/client";

export const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email, password) => {
    return await supabase.auth.signUp({ email, password});
};

export const logout = async () => {
    return await supabase.auth.signOut();
};

export const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
};

export const getSession = async () => {
    const {data, error} = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
};
//método para escuchar cambios en el estado de autenticación, como inicio de sesión
export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange(callback);
};

export const resetPassword = async (email, error) => {
    return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
    })
};
//método se usa para actualizar la sesión con nuevos tokens, por ejemplo después de un reset de contraseña
export const setSession = async (access_token, refresh_token) => {
    return await supabase.auth.setSession({access_token, refresh_token});
};

export const updateUser = async (userData) => {
    return await supabase.auth.updateUser(userData);
};