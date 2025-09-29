// Función para obtener los bloques de invitaciones
export function getInviteBlock(projectId, email) {
  if (!projectId || !email) return null;
  
  try {
    const blocks = JSON.parse(localStorage.getItem('invite-blocks-v1') || '{}');
    if (!blocks[projectId]) return null;
    
    const emailLower = email.toLowerCase();
    return blocks[projectId][emailLower] || null;
  } catch (err) {
    console.error("Error al obtener bloque de invitación:", err);
    return null;
  }
}

// Función para eliminar bloques expirados
export function purgeBlocks(projectId, currentTime) {
  if (!projectId) return;
  
  try {
    const blocks = JSON.parse(localStorage.getItem('invite-blocks-v1') || '{}');
    if (!blocks[projectId]) return;
    
    let cleaned = false;
    for (const [email, expiry] of Object.entries(blocks[projectId])) {
      if (expiry && currentTime > expiry) {
        delete blocks[projectId][email];
        cleaned = true;
      }
    }
    
    if (cleaned) {
      localStorage.setItem('invite-blocks-v1', JSON.stringify(blocks));
    }
  } catch (err) {
    console.error("Error al limpiar bloques:", err);
  }
}

// Función para establecer un bloqueo temporal
export function setInviteBlock(projectId, email, expirationTime) {
  if (!projectId || !email || !expirationTime) return;
  
  try {
    const blocks = JSON.parse(localStorage.getItem('invite-blocks-v1') || '{}');
    if (!blocks[projectId]) blocks[projectId] = {};
    
    blocks[projectId][email.toLowerCase()] = expirationTime;
    localStorage.setItem('invite-blocks-v1', JSON.stringify(blocks));
  } catch (err) {
    console.error("Error al establecer bloqueo:", err);
  }
}

// Función para eliminar un bloqueo específico
export function removeInviteBlock(projectId, email) {
  if (!projectId || !email) return;
  
  try {
    const blocks = JSON.parse(localStorage.getItem('invite-blocks-v1') || '{}');
    if (!blocks[projectId]) return;
    
    delete blocks[projectId][email.toLowerCase()];
    localStorage.setItem('invite-blocks-v1', JSON.stringify(blocks));
  } catch (err) {
    console.error("Error al eliminar bloqueo:", err);
  }
}