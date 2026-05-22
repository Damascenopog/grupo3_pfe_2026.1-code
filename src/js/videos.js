import { conteudosYoutube } from "./dados-youtube.js";

function createVideoCard(item) {
    const card = document.createElement("div");
    card.className = "video-card";

    const thumbUrl = `https://img.youtube.com/vi/${item.capa}/hqdefault.jpg`;

    // Use o título completo no DOM; o truncamento visual é feito por CSS (line-clamp)
    const safeTitle = item.titulo || "";

    card.innerHTML = `
    <a class="video-thumb-link" href="${item.url}" target="_blank" rel="noopener noreferrer">
      <img src="${thumbUrl}" alt="${safeTitle}" class="video-thumb">
    </a>
    <div class="video-info">
      <h3 class="video-title">${safeTitle}</h3>
      <div class="video-date">${item.data}</div>
      <a class="video-link" href="${item.url}" target="_blank" rel="noopener noreferrer">Assistir no YouTube</a>
    </div>
  `;

    return card;
}

export async function init() {
    const grid = document.getElementById("videos-grid");
    if (!grid) return;

    const items = Array.isArray(conteudosYoutube)
        ? conteudosYoutube.slice(0, 4)
        : [];
    items.forEach((it) => grid.appendChild(createVideoCard(it)));

    // Caso queira um aviso adicional abaixo do grid, já temos o link 'Ver mais' no header.
}

export default { init };
