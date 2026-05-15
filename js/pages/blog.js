import { fetchPosts } from "../api/posts.js";

const idArtigos = 20;
const itensPorPagina = 6;

const gridArtigos = document.getElementById("blog-grid-artigos");
const gridNewsletter = document.getElementById("blog-grid-newsletter");
const pagArtigos = document.getElementById("blog-pagination-artigos");
const pagNewsletter = document.getElementById("blog-pagination-newsletter");

const estadoGalerias = {
  artigos: { lista: [], pagina: 1 },
  newsletter: { lista: [], pagina: 1 },
};

export const formatarData = (dateString) => {
  const data = new Date(dateString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const limitarTexto = (texto, limite) => {
  if (!texto || texto.length <= limite) return texto || "";
  return `${texto.slice(0, limite).trim()}...`;
};

export const obterImagem = (post) => {
  const imagemEmbed = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return imagemEmbed || "images/logo-acb.png";
};

export const obterTag = (post) => {
  if (post.categories?.includes(idArtigos)) return "Artigo";
  return "Newsletter";
};

export const artigo = (post) => Boolean(post.categories?.includes(idArtigos));
export const newsletter = (post) => !artigo(post);

export const htmlCardPost = (post) => {
  const titulo = post.title?.rendered;
  const resumo = limitarTexto(post.excerpt?.rendered, 140);
  const data = formatarData(post.date);
  const url = post.link || "#";
  const imagem = obterImagem(post);
  const tag = obterTag(post);
  return `
        <div class="blog-card">
          <div class="blog-card-img">
            <img src="${imagem}" alt="${titulo}">
          </div>
          <div class="blog-card-body">
            <span class="blog-tag mercado">${tag}</span>
            <h3>${titulo}</h3>
            <p>${resumo}</p>
            <div class="blog-card-footer">
              <span class="blog-date">${data}</span>
              <a href="${post.id}" class="ler-mais" target="_blank" rel="noopener noreferrer">Ler mais &rarr;</a>
            </div>
          </div>
        </div>
      `;
};

export const renderizarPostsNoContainer = (container, posts) => {
  if (!container) return;
  if (!posts.length) {
    container.innerHTML =
      '<p class="blog-empty">Nenhum conteúdo disponível nesta seção.</p>';
    return;
  }
  container.innerHTML = posts.map((post) => htmlCardPost(post)).join("");
};

const totalPaginasLista = (totalItens, porPagina) =>
  Math.max(1, Math.ceil(totalItens / porPagina));

const fatiarPagina = (lista, pagina, porPagina) => {
  const inicio = (pagina - 1) * porPagina;
  return lista.slice(inicio, inicio + porPagina);
};

const montarPaginacao = (containerPag, tipo) => {
  if (!containerPag) return;
  const st = estadoGalerias[tipo];
  const total = st.lista.length;
  const porPagina = itensPorPagina;
  const totalPag = totalPaginasLista(total, porPagina);
  if (total === 0 || totalPag <= 1) {
    containerPag.innerHTML = "";
    containerPag.style.display = "none";
    return;
  }

  containerPag.style.display = "flex";
  const pagina = Math.min(Math.max(1, st.pagina), totalPag);
  st.pagina = pagina;
  containerPag.innerHTML = `
    <button type="button" data-blog-gallery="${tipo}" data-blog-action="prev"${pagina <= 1 ? " disabled" : ""}>Anterior</button>
    <span class="blog-pagination-info">Página ${pagina} de ${totalPag}</span>
    <button type="button" data-blog-gallery="${tipo}" data-blog-action="next"${pagina >= totalPag ? " disabled" : ""}>Próximo</button>
  `;

  containerPag.querySelectorAll("button[data-blog-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-blog-action");
      const g = btn.getAttribute("data-blog-gallery");
      if (!g || (g !== "artigos" && g !== "newsletter")) return;
      const maxP = totalPaginasLista(estadoGalerias[g].lista.length, porPagina);
      let nova = estadoGalerias[g].pagina;
      if (action === "prev") nova -= 1;
      if (action === "next") nova += 1;
      estadoGalerias[g].pagina = Math.min(Math.max(1, nova), maxP);
      redesenharGaleriaBlog(g);
    });
  });
};

const redesenharGaleriaBlog = (tipo) => {
  const st = estadoGalerias[tipo];
  const grid = tipo === "artigos" ? gridArtigos : gridNewsletter;
  const pag = tipo === "artigos" ? pagArtigos : pagNewsletter;
  const maxP = totalPaginasLista(st.lista.length, itensPorPagina);
  if (st.pagina > maxP) st.pagina = maxP;
  const visiveis = fatiarPagina(st.lista, st.pagina, itensPorPagina);
  renderizarPostsNoContainer(grid, visiveis);
  montarPaginacao(pag, tipo);
};

export const initBlog = async () => {
  if (!gridArtigos && !gridNewsletter) return;

  const posts = await fetchPosts();
  if (!posts?.length) {
    renderizarPostsNoContainer(gridArtigos, []);
    renderizarPostsNoContainer(gridNewsletter, []);
    return;
  }

  estadoGalerias.artigos.lista = posts.filter(artigo);
  estadoGalerias.newsletter.lista = posts.filter(newsletter);
  estadoGalerias.artigos.pagina = 1;
  estadoGalerias.newsletter.pagina = 1;
  redesenharGaleriaBlog("artigos");
  redesenharGaleriaBlog("newsletter");
};

// Inicia o script de blog apenas se o contêiner estiver presente
if (
  document.getElementById("blog-grid-artigos") ||
  document.getElementById("blog-grid-newsletter")
) {
  initBlog();
}
