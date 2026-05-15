import { API_BASE_URL } from './config.js';

export async function getAssociates() {
    try {
        // Agora sabemos que a rota é /users
        const response = await fetch(`${API_BASE_URL}/users`);
        
        if (!response.ok) {
            throw new Error('Falha ao buscar a lista de associados.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na API:', error);
        return []; 
    }
}