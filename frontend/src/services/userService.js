import { client } from '../supabase/client';

export const getUserProfile = async (authUserId) => {
    const { data, error } = await client
        .from('Usuario')
        .select('idUsuario, nombre, apellido, estado, correoElectronico, contraseña, auth_user_id, rol_idRol')
        .eq('auth_user_id', authUserId)
        .single();
    if (error) {
        throw new Error('Error al traer el usuario: ' + error.message);
    }
    return data;
};