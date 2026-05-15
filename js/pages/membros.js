import { getAssociates } from '../api/associates.js';

const membersGrid = document.getElementById('members-grid'); // Altere para o ID da sua div

function renderMembers(members) {
    // Limpa o estado de "Carregando..."
    membersGrid.innerHTML = '';

    members.forEach(member => {
        // O WP fornece tamanhos de avatar (24, 48, 96). Pegamos o maior disponível,
        // ou usamos uma imagem placeholder padrão caso o usuário não tenha gravatar.
        const avatarUrl = member.avatar_urls['96'] || 'assets/default-avatar.png';
        
        // Extrai apenas o primeiro parágrafo ou corta o texto se a 'description' for muito longa
        const shortDescription = member.description.length > 100 
            ? member.description.substring(0, 100) + '...' 
            : member.description;

        const cardHTML = `
            <div class="card-member">
                <img src="${avatarUrl}" alt="Foto de ${member.name}" class="member-avatar">
                <div class="member-info">
                    <h3 class="member-name">${member.name}</h3>
                    <p class="member-description">${shortDescription}</p>
                    <a href="${member.link}" target="_blank" class="btn-outline">Ver Perfil</a>
                </div>
            </div>
        `;
        
        membersGrid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

async function init() {
    membersGrid.innerHTML = '<p>Carregando associados...</p>';
    const data = await getAssociates();
    renderMembers(data);
}

init();