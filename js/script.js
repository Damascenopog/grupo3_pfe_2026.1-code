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
const newsletterTitle = document.getElementById("newsletter-title");
const newsletterKicker = document.getElementById("newsletter-kicker");
const newsletterLink = document.getElementById("newsletter-link");

// LISTAS FILTRADAS E PÁGINA ATUAL PARA CADA GALERIA (APENAS USADO EM blog.html)
const estadoGalerias = {
  artigos: { lista: [], pagina: 1 },
  newsletter: { lista: [], pagina: 1 },
};

// FUNÇÃO QUE FAZ A REQUISIÇÃO NA API DE DADOS
const postsApi = async () => {
  const baseURL = "https://acbrasil.org.br/cms/wp-json/wp/v2/posts";
  // POSTS RECEBIDOS POR PAGINA
  const postsPorPagina = 100;

  try {
    // PRIMEIRA REQUISIÇÃO; _embed TRAZ IMAGEM DE DESTAQUE E DADOS RELACIONADOS NO JSON
    const responseInicial = await fetch(
      `${baseURL}?per_page=${postsPorPagina}&page=1&_embed=1`,
    );

    // CABEÇALHO PADRÃO DO WP REST INFORMA QUANTAS PÁGINAS EXISTEM PARA O per_page ESCOLHIDO
    const totalPaginas = parseInt(
      responseInicial.headers.get("X-WP-TotalPages"),
    );

    let todosPosts = await responseInicial.json();

    // SE HOUVER MAIS DE UMA PÁGINA, BUSCA O RESTANTE EM PARALELO E CONCATENA NO MESMO ARRAY
    if (totalPaginas > 1) {
      const pages = [];

      for (let i = 2; i <= totalPaginas; i++) {
        pages.push(
          fetch(
            `${baseURL}?per_page=${postsPorPagina}&page=${i}&_embed=1`,
          ).then((res) => res.json()),
        );
      }

      const pagesRestantes = await Promise.all(pages);
      pagesRestantes.forEach((paginasPosts) => {
        todosPosts = todosPosts.concat(paginasPosts);
      });
    }
    console.log(`Total de posts baixados ${todosPosts.length}`);

    return todosPosts;
  } catch (error) {
    console.error("Erro ao carregar artigos:", error);
  }
};

// FORMATA A DATA DOS POSTS
const formatarData = (dateString) => {
  const data = new Date(dateString);

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// LIMITA O TAMANHO DO TEXTO DO ARTIGO PARA O MESMO SE ENCAIXAR NO CARD DE ARTIGOS RECENTES NA PAGINA HOME
const limitarTexto = (texto, limite) => {
  if (!texto || texto.length <= limite) return texto || "";
  return `${texto.slice(0, limite).trim()}...`;
};

//FUNÇÃO CRIADA PARA RECEBER OS POSTS COMO ARGUMENTOS E ACESSAR AS PROPRIEDADES DO MESMO, PARA ARMAZENAR A IMAGEM EM UMA VARIAVEL E POSTERIORMENTE EXIBI-LA NO CARD
const obterImagem = (post) => {
  const imagemEmbed = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return imagemEmbed || "images/logo-acb.png";
};

// FUNÇÃO CRIADA PARA RECEBER OS POSTS COMO ARGUMENTOS E VERIFICAR SE OS MESMOS CONTEM O ID REFERENTE AO TEMA ARTIGOS, ENTÃO EXIBE A TAG ARTIGOS, RESTANDO APENAS A NEWSLETTER
const obterTag = (post) => {
  if (post.categories?.includes(idArtigos)) return "Artigo";
  return "Newsletter";
};

// POSTS COM CATEGORIA DE ARTIGO (ID_ARTIGOS)
const artigo = (post) => Boolean(post.categories?.includes(idArtigos));

// POSTS QUE NÃO SÃO CLASSIFICADOS COMO ARTIGO (EXIBIDOS COMO NEWSLETTER)
const newsletter = (post) => !artigo(post);

// RETORNA O HTML DE UM ÚNICO CARD
const htmlCardPost = (post) => {
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
              <a href="${url}" class="ler-mais" target="_blank" rel="noopener noreferrer">Ler mais &rarr;</a>
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
      const maxP = totalPaginasLista(estadoGalerias[g].lista.length, porPagina);
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

// FUNÇÃO CRIADA PARA RECEBER AS PROPRIEDADES DO POST E EXIBIR NO CARD (COMPATÍVEL COM A HOME: USA #blog-grid)
const renderizarBlog = (posts) => {
  renderizarPostsNoContainer(blogGrid, posts);
};

// PONTO DE ENTRADA AO CARREGAR O SCRIPT: USA async/await PARA AGUARDAR A API
(async () => {
  const posts = await postsApi();
  if (!posts?.length) return;
  const isBlogPage = /blog\.html$/i.test(window.location.pathname);
  if (isBlogPage && gridArtigos && gridNewsletter) {
    estadoGalerias.artigos.lista = posts.filter(artigo);
    estadoGalerias.newsletter.lista = posts.filter(newsletter);
    estadoGalerias.artigos.pagina = 1;
    estadoGalerias.newsletter.pagina = 1;
    redesenharGaleriaBlog("artigos");
    redesenharGaleriaBlog("newsletter");
    return;
  }

  // HOME (OU OUTRAS PÁGINAS COM #blog-grid): APENAS OS TRÊS ARTIGOS MAIS RECENTES
  const artigosRecentes = posts.filter(postEhArtigo).slice(0, 3);
  renderizarBlog(artigosRecentes);
})();
