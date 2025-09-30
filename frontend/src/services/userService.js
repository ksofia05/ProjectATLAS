import { client } from '../supabase/client';

export const getUserProfile = async (authUserId) => {
    try {
        // Intento principal
        const { data, error } = await client
            .from('Usuario')
            .select('idUsuario, nombre, apellido, estado, correoElectronico, contraseña, auth_user_id, rol_idrol')
            .eq('auth_user_id', authUserId)
            .single();
        
        if (error) {
            console.warn('Error inicial obteniendo perfil:', error);
            
            // Segundo intento con delay si hay error
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const secondAttempt = await client
                .from('Usuario')
                .select('idUsuario, nombre, apellido, estado, correoElectronico, contraseña, auth_user_id, rol_idrol')
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

export const getUserFromDjango = async (email) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/tasks/api/v1/usuarios/?correoelectronico=${email}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return data[0]; // Retorna el primer usuario encontrado
        }
        
        return null;
    } catch (error) {
        console.error('Error obteniendo usuario desde Django:', error);
        throw error;
    }
};

// Función mejorada que combina Supabase + Django
export const getCompleteUserProfile = async (authUserId, email) => {
    try {
        // 1. Intentar obtener desde Supabase
        const supabaseProfile = await getUserProfile(authUserId).catch(() => null);
        
        // 2. Obtener datos actualizados desde Django
        let djangoUser = null;
        if (email) {
            djangoUser = await getUserFromDjango(email).catch(() => null);
        }
        
        // 3. Combinar datos, dando prioridad a Django para el rol
        const combinedProfile = {
            ...supabaseProfile,
            ...djangoUser,
            // Asegurar campos críticos
            rol_idRol: djangoUser?.rol_idrol || djangoUser?.rol_idRol || supabaseProfile?.rol_idRol,
            idUsuario: djangoUser?.idusuario || djangoUser?.idUsuario || supabaseProfile?.idUsuario,
        };
        
        console.log('Perfil combinado obtenido:', {
            supabase: !!supabaseProfile,
            django: !!djangoUser,
            rol: combinedProfile.rol_idRol
        });
        
        return combinedProfile;
    } catch (error) {
        console.error('Error en getCompleteUserProfile:', error);
        // Fallback al método original
        return await getUserProfile(authUserId);
    }
};