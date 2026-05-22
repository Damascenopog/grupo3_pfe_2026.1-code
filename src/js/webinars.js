import { webinarYoutube } from "./dados-youtube.js";

const thumbMax = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
const thumbFallback = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

function configurarImagemYoutube(img, videoId) {
    img.src = thumbMax(videoId);
    img.onerror = () => {
        img.onerror = null;
        img.src = thumbFallback(videoId);
    };
}

function criarCardWebinar(item) {
    const link = document.createElement("a");
    link.className = "webinar-card";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Assistir webinar: ${item.titulo}`);

    const media = document.createElement("div");
    media.className = "webinar-card-media";

    const img = document.createElement("img");
    img.alt = item.titulo;
    img.loading = "lazy";
    configurarImagemYoutube(img, item.capa);

    const tag = document.createElement("span");
    tag.className = "webinar-tag";
    tag.textContent = item.tag || "Webinar";

    media.append(img, tag);

    const body = document.createElement("div");
    body.className = "webinar-card-body";

    const meta = document.createElement("span");
    meta.className = "webinar-card-meta";
    meta.textContent = `Webinar ${item.id}`;

    const title = document.createElement("h3");
    title.textContent = item.titulo;

    const cta = document.createElement("span");
    cta.className = "webinar-card-link";
    cta.textContent = "Assistir no YouTube";

    body.append(meta, title, cta);
    link.append(media, body);

    return link;
}

function renderizarDestaque() {
    const container = document.getElementById("webinar-destaque");
    if (!container) return;

    const item = webinarYoutube.find((webinar) => webinar.id === 1);
    if (!item) return;

    container.innerHTML = "";

    const mediaLink = document.createElement("a");
    mediaLink.className = "destaque-image-card webinar-featured-media";
    mediaLink.href = item.url;
    mediaLink.target = "_blank";
    mediaLink.rel = "noopener noreferrer";
    mediaLink.setAttribute("aria-label", `Assistir webinar: ${item.titulo}`);

    const img = document.createElement("img");
    img.alt = item.titulo;
    configurarImagemYoutube(img, item.capa);

    const tag = document.createElement("div");
    tag.className = "destaque-tag";
    tag.textContent = item.tag || "Webinar";

    const caption = document.createElement("div");
    caption.className = "destaque-image-caption";

    const captionTitle = document.createElement("h3");
    captionTitle.textContent = item.titulo;

    const captionMeta = document.createElement("p");
    captionMeta.className = "destaque-meta";
    captionMeta.textContent = `Webinar ${item.id}`;

    caption.append(captionTitle, captionMeta);
    mediaLink.append(img, tag, caption);

    const content = document.createElement("div");
    content.className = "destaque-content";

    const title = document.createElement("h2");
    title.textContent = item.titulo;

    const description = document.createElement("p");
    description.textContent = item.destaque || "Assista ao webinar da ACBrasil no YouTube.";

    const button = document.createElement("a");
    button.className = "btn-primary";
    button.href = item.url;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.textContent = "Assistir webinar \u2192";

    content.append(title, description, button);
    container.append(mediaLink, content);
}

function renderizarHomeCards() {
    const container = document.getElementById("webinar-home-grid");
    if (!container) return;

    container.innerHTML = "";
    webinarYoutube
        .filter((item) => item.id >= 2 && item.id <= 4)
        .forEach((item) => container.appendChild(criarCardWebinar(item)));
}

function renderizarPaginaEventos() {
    const container = document.getElementById("webinar-eventos-grid");
    if (!container) return;

    container.innerHTML = "";
    webinarYoutube.forEach((item) => container.appendChild(criarCardWebinar(item)));
}

export function init() {
    renderizarDestaque();
    renderizarHomeCards();
    renderizarPaginaEventos();
}

export default { init };
