// Módulo responsável pelo comportamento da página de blog e posts
// Paths relativos: este arquivo está em src/js, a API WP está em src/api

// ID DA CATEGORIA "ARTIGOS" NO WORDPRESS; SERVE PARA EXIBIR A TAG CORRETA NO CARD
const idArtigos = 20;

// QUANTOS CARDS POR PÁGINA EM CADA GALERIA DA PÁGINA blog.html
const itensPorPagina = 6;

// REFERÊNCIAS AOS ELEMENTOS DO HTML ONDE O CONTEÚDO SERÁ INSERIDO OU ATUALIZADO
const blogGrid = document.getElementById("blog-grid");
const gridArtigos = document.getElementById("blog-grid-artigos");
const gridNewsletter = document.getElementById("blog-grid-newsletter");
const pagArtigos = document.getElementById("blog-pagination-artigos");
const pagNewsletter = document.getElementById("blog-pagination-newsletter");
const blogPostContainer = document.getElementById("blog-post-content");
const buscaArtigos = document.getElementById("blog-search-artigos");
const buscaNewsletter = document.getElementById("blog-search-newsletter");
const sugestoesArtigos = document.getElementById(
    "blog-search-artigos-suggestions",
);
const sugestoesNewsletter = document.getElementById(
    "blog-search-newsletter-suggestions",
);

// LISTAS FILTRADAS E PÁGINA ATUAL PARA CADA GALERIA (APENAS USADO EM blog.html)
const estadoGalerias = {
    artigos: { listaBase: [], lista: [], pagina: 1, termo: "" },
    newsletter: { listaBase: [], lista: [], pagina: 1, termo: "" },
};

// funções utilitárias
const formatarData = (dateString) => {
    const data = new Date(dateString);

    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const limitarTexto = (texto, limite) => {
    if (!texto || texto.length <= limite) return texto || "";
    return `${texto.slice(0, limite).trim()}...`;
};

const removerTagsHtml = (texto = "") => texto.replace(/<[^>]*>/g, "").trim();

const normalizarTexto = (texto = "") =>
    texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

const CACHE_KEY_POSTS = "acbrasil_blog_posts_cache_v1";

const lerCachePosts = () => {
    try {
        const raw = window.localStorage.getItem(CACHE_KEY_POSTS);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed?.posts) ? parsed.posts : [];
    } catch (error) {
        console.warn("Falha ao ler cache dos posts:", error);
        return [];
    }
};

const salvarCachePosts = (posts) => {
    try {
        window.localStorage.setItem(
            CACHE_KEY_POSTS,
            JSON.stringify({
                savedAt: new Date().toISOString(),
                posts,
            }),
        );
    } catch (error) {
        console.warn("Falha ao salvar cache dos posts:", error);
    }
};

const acharPostNoCache = (id) => {
    const posts = lerCachePosts();
    return posts.find((post) => Number(post.id) === Number(id)) || null;
};

/* Inline spinner helpers: placed inside target containers and non-blocking */
const createInlineSpinner = (container) => {
    if (!container) return null;
    // avoid duplicate
    const existing = container.querySelector(".inline-spinner");
    if (existing) return existing;

    // ensure container can host absolutely positioned child if needed
    const cs = window.getComputedStyle(container);
    if (cs.position === "static" || !cs.position) {
        container.dataset._originalPosition = container.style.position || "";
        container.style.position = "relative";
    }

    const wrapper = document.createElement("div");
    wrapper.className = "inline-spinner";
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.innerHTML = `
      <div class="global-spinner" role="status" aria-label="Carregando">
        <div class="ring ring-blue"></div>
        <div class="ring ring-yellow"></div>
        <div class="center-dot"></div>
      </div>
    `;

    container.appendChild(wrapper);
    return wrapper;
};

const showInlineSpinner = (container) => {
    if (!container) return;
    const s = createInlineSpinner(container);
    if (!s) return;
    s.classList.remove("hidden");
};

const hideInlineSpinner = (container) => {
    if (!container) return;
    const s = container.querySelector(".inline-spinner");
    if (!s) return;
    s.classList.add("hidden");
};

// FUNÇÃO QUE FAZ A REQUISIÇÃO NA API DE DADOS
// aceita array de containers onde o spinner será exibido (opcional)
const postsApi = async (containers = []) => {
    const cachedPosts = lerCachePosts();
    if (cachedPosts.length) {
        return cachedPosts;
    }

    (containers || []).forEach((c) => showInlineSpinner(c));
    try {
        const { getAllPosts } = await import("../api/wordpress.js");
        const todosPosts = await getAllPosts({ perPage: 100, embed: true });
        console.log(`Total de posts baixados ${todosPosts.length}`);
        salvarCachePosts(todosPosts);

        return todosPosts;
    } catch (error) {
        console.error("Erro ao carregar artigos:", error);
    } finally {
        (containers || []).forEach((c) => hideInlineSpinner(c));
    }
};

const postPorIdApi = async (id, container = null) => {
    const cachedPost = acharPostNoCache(id);
    if (cachedPost) {
        return cachedPost;
    }

    if (container) showInlineSpinner(container);
    try {
        const { getPostById } = await import("../api/wordpress.js");
        const post = await getPostById(id, { embed: true });

        const posts = lerCachePosts();
        const existeNoCache = posts.some(
            (item) => Number(item.id) === Number(id),
        );
        const postsAtualizados = existeNoCache
            ? posts.map((item) =>
                  Number(item.id) === Number(id) ? post : item,
              )
            : [...posts, post];
        salvarCachePosts(postsAtualizados);

        return post;
    } catch (error) {
        console.error("Erro ao carregar artigo completo:", error);
    } finally {
        if (container) hideInlineSpinner(container);
    }
};

const obterImagem = (post) => {
    const imagemEmbed = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    return imagemEmbed || "images/logo-acb.png";
};

const obterLinkDetalhe = (postId) => {
    const estaDentroDeViews = /\/views\//i.test(window.location.pathname);
    const caminhoBase = estaDentroDeViews
        ? "blog-post.html"
        : "views/blog-post.html";
    return `${caminhoBase}?id=${postId}`;
};

const obterTag = (post) => {
    if (post.categories?.includes(idArtigos)) return "Artigo";
    return "Newsletter";
};

const obterCategorias = (post) => {
    const termosTaxonomia = post?._embedded?.["wp:term"] || [];

    return termosTaxonomia
        .flat()
        .filter((termo) => termo?.taxonomy === "category")
        .map((termo) => termo.name)
        .filter(Boolean);
};

// POSTS COM CATEGORIA DE ARTIGO (ID_ARTIGOS)
const artigo = (post) => Boolean(post.categories?.includes(idArtigos));

// POSTS QUE NÃO SÃO CLASSIFICADOS COMO ARTIGO (EXIBIDOS COMO NEWSLETTER)
const newsletter = (post) => !artigo(post);

// RETORNA O HTML DE UM ÚNICO CARD
const htmlCardPost = (post) => {
    const titulo = removerTagsHtml(post.title?.rendered);
    const resumo = limitarTexto(removerTagsHtml(post.excerpt?.rendered), 140);
    const data = formatarData(post.date);
    const url = obterLinkDetalhe(post.id);
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
              <a href="${url}" class="ler-mais">Ler mais &rarr;</a>
            </div>
          </div>
        </div>
      `;
};

// RENDERIZA UMA LISTA DE POSTS DENTRO DE UM CONTAINER (QUALQUER ELEMENTO COM GRID DE CARDS)
const renderizarPostsNoContainer = (container, posts) => {
    if (!container) return;
    if (!posts.length) {
        container.innerHTML =
            '<p class="blog-empty">Nenhum conteúdo disponível nesta seção.</p>';
        return;
    }
    container.innerHTML = posts.map((post) => htmlCardPost(post)).join("");
};

// CALCULA QUANTAS PÁGINAS EXISTEM PARA UMA LISTA E UM TAMANHO DE PÁGINA
const totalPaginasLista = (totalItens, porPagina) =>
    Math.max(1, Math.ceil(totalItens / porPagina));

// RETORNA O RECORTE DA LISTA CORRESPONDENTE À PÁGINA ATUAL
const fatiarPagina = (lista, pagina, porPagina) => {
    const inicio = (pagina - 1) * porPagina;
    return lista.slice(inicio, inicio + porPagina);
};

// ATUALIZA OS BOTÕES "ANTERIOR" / "PRÓXIMO" E O TEXTO DA PÁGINA ATUAL
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
            const maxP = totalPaginasLista(
                estadoGalerias[g].lista.length,
                porPagina,
            );
            let nova = estadoGalerias[g].pagina;
            if (action === "prev") nova -= 1;
            if (action === "next") nova += 1;
            estadoGalerias[g].pagina = Math.min(Math.max(1, nova), maxP);
            redesenharGaleriaBlog(g);
        });
    });
};

// REDESENHA GRADE E PAGINAÇÃO DE UMA DAS DUAS GALERIAS DO BLOG
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

const filtrarPostsPorTermo = (lista, termo, tipo) => {
    const termoNormalizado = normalizarTexto(termo);
    if (!termoNormalizado) return lista;

    return lista.filter((post) => {
        const titulo = normalizarTexto(removerTagsHtml(post.title?.rendered));
        const categorias = obterCategorias(post).map(normalizarTexto);
        const categoriaTipo = normalizarTexto(
            tipo === "artigos" ? "Artigo" : "Newsletter",
        );

        return (
            titulo.includes(termoNormalizado) ||
            categorias.some((categoria) =>
                categoria.includes(termoNormalizado),
            ) ||
            categoriaTipo.includes(termoNormalizado)
        );
    });
};

const preencherSugestoes = (tipo, termo = "") => {
    const datalist =
        tipo === "artigos" ? sugestoesArtigos : sugestoesNewsletter;
    if (!datalist) return;

    const st = estadoGalerias[tipo];
    const termoNormalizado = normalizarTexto(termo);

    const titulos = st.listaBase
        .map((post) => removerTagsHtml(post.title?.rendered))
        .filter(Boolean);

    const categorias = st.listaBase.flatMap((post) => obterCategorias(post));
    const tipoCategoria = tipo === "artigos" ? "Artigo" : "Newsletter";

    const opcoes = [...new Set([...titulos, ...categorias, tipoCategoria])]
        .filter((valor) => {
            if (!termoNormalizado) return true;
            return normalizarTexto(valor).includes(termoNormalizado);
        })
        .slice(0, 8);

    datalist.innerHTML = opcoes
        .map((opcao) => `<option value="${opcao}"></option>`)
        .join("");
};

const aplicarFiltroGaleria = (tipo, termo = "") => {
    const st = estadoGalerias[tipo];
    st.termo = termo;
    st.lista = filtrarPostsPorTermo(st.listaBase, termo, tipo);
    st.pagina = 1;
    preencherSugestoes(tipo, termo);
    redesenharGaleriaBlog(tipo);
};

const configurarBuscaBlog = () => {
    if (buscaArtigos) {
        preencherSugestoes("artigos");
        buscaArtigos.addEventListener("input", (event) => {
            aplicarFiltroGaleria("artigos", event.target.value || "");
        });
    }

    if (buscaNewsletter) {
        preencherSugestoes("newsletter");
        buscaNewsletter.addEventListener("input", (event) => {
            aplicarFiltroGaleria("newsletter", event.target.value || "");
        });
    }
};

// FUNÇÃO CRIADA PARA RECEBER AS PROPRIEDADES DO POST E EXIBIR NO CARD (COMPATÍVEL COM A HOME: USA #blog-grid)
const renderizarBlog = (posts) => {
    renderizarPostsNoContainer(blogGrid, posts);
};

const renderizarPostCompleto = (post) => {
    if (!blogPostContainer) return;

    if (!post) {
        blogPostContainer.innerHTML = `
      <article class="blog-post-empty">
        <h2>Artigo nao encontrado</h2>
        <p>O conteudo solicitado nao foi localizado. Volte para o blog e escolha outro artigo.</p>
        <a href="blog.html" class="blog-post-back">Voltar para o blog</a>
      </article>
    `;
        return;
    }

    const titulo = removerTagsHtml(post.title?.rendered);
    const data = formatarData(post.date);
    const categoria = obterTag(post);
    const imagem = obterImagem(post);
    const conteudo = post.content?.rendered || "";

    document.title = `${titulo} | Blog ACBrasil`;

    blogPostContainer.innerHTML = `
    <article class="blog-post-article">
      <header class="blog-post-header">
        <span class="blog-tag mercado">${categoria}</span>
        <h1>${titulo}</h1>
        <p class="blog-post-meta">Publicado em ${data}</p>
      </header>

      <div class="blog-post-image">
        <img src="${imagem}" alt="${titulo}">
      </div>

      <section class="blog-post-body">
        ${conteudo}
      </section>

      <footer class="blog-post-footer">
        <a href="blog.html" class="blog-post-back">Voltar para o blog</a>
      </footer>
    </article>
  `;
};

export async function init() {
    const isPostPage = /blog-post\.html$/i.test(window.location.pathname);
    if (isPostPage && blogPostContainer) {
        const parametros = new URLSearchParams(window.location.search);
        const postId = Number(parametros.get("id"));
        const post =
            Number.isFinite(postId) && postId > 0
                ? await postPorIdApi(postId, blogPostContainer)
                : null;
        renderizarPostCompleto(post);
        return;
    }

    if (!blogGrid && !gridArtigos && !gridNewsletter) return;

    const posts = await postsApi([gridArtigos, gridNewsletter, blogGrid]);
    if (!posts?.length) {
        renderizarPostsNoContainer(blogGrid, []);
        renderizarPostsNoContainer(gridArtigos, []);
        renderizarPostsNoContainer(gridNewsletter, []);
        return;
    }
    const isBlogPage = /blog\.html$/i.test(window.location.pathname);
    if (isBlogPage && gridArtigos && gridNewsletter) {
        estadoGalerias.artigos.listaBase = posts.filter(artigo);
        estadoGalerias.newsletter.listaBase = posts.filter(newsletter);
        estadoGalerias.artigos.lista = [...estadoGalerias.artigos.listaBase];
        estadoGalerias.newsletter.lista = [
            ...estadoGalerias.newsletter.listaBase,
        ];
        estadoGalerias.artigos.pagina = 1;
        estadoGalerias.newsletter.pagina = 1;
        redesenharGaleriaBlog("artigos");
        redesenharGaleriaBlog("newsletter");
        configurarBuscaBlog();
        return;
    }

    // HOME (OU OUTRAS PÁGINAS COM #blog-grid): APENAS OS TRÊS ARTIGOS MAIS RECENTES
    const artigosRecentes = posts.filter(artigo).slice(0, 3);
    renderizarBlog(artigosRecentes);
}
