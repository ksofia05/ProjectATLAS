import { client } from '../supabase/client';

export const getUserProfile = async (authUserId) => {
    try {
        // Intento principal
        const { data, error } = await client
            .from('Usuario')
            .select('idUsuario, nombre, apellido, estado, correoElectronico, contraseña, auth_user_id, rol_idRol')
            .eq('auth_user_id', authUserId)
            .single();
        
        if (error) {
            console.warn('Error inicial obteniendo perfil:', error);
            
            // Segundo intento con delay si hay error
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const secondAttempt = await client
                .from('Usuario')
                .select('idUsuario, nombre, apellido, estado, correoElectronico, contraseña, auth_user_id, rol_idRol')
                .eq('auth_user_id', authUserId)
                .single();
            
            if (secondAttempt.error) {
                throw new Error('Error al traer el usuario: ' + secondAttempt.error.message);
            }
            
            return secondAttempt.data;
        }
        
        return data;
    } catch (e) {
        console.error('Error en getUserProfile:', e);
        
        // Si es un error de red, indicarlo específicamente
        if (e.message && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'))) {
            throw new Error('Error de conexión: Comprueba tu red');
        }
        
        throw e;
    }
};

// Función para actualizar perfil de usuario
export const updateUserProfile = async (userId, userData) => {
    try {
        const { data, error } = await client
            .from('Usuario')
            .update(userData)
            .eq('idUsuario', userId)
            .select()
            .single();

        if (error) throw new Error('Error al actualizar el usuario: ' + error.message);
        return data;
    } catch (e) {
        console.error('Error en updateUserProfile:', e);
        throw e;
    }
};

// Función ligera para verificar la conectividad con Supabase
export const pingSupabase = async () => {
    try {
        const start = Date.now();
        // Consulta muy pequeña solo para verificar conexión
        const { error } = await client
            .from('Usuario')
            .select('count')
            .limit(1)
            .maybeSingle();
        
        const elapsed = Date.now() - start;
        
        if (error) {
            console.error('Error en ping:', error);
            return { success: false, error, latency: elapsed };
        }
        
        console.log(`🔄 Ping completado en ${elapsed}ms`);
        return { success: true, latency: elapsed };
    } catch (error) {
        console.error('Error en ping:', error);
        return { success: false, error };
    }
};