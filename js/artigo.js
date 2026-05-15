// ARQUIVO ESPECÍFICO PARA A PÁGINA artigo.html
// Carrega e exibe um artigo completo baseado no ID na URL

console.log("✓ Script artigo.js carregado");

// EXTRAI O PARÂMETRO ID DA URL
const obterIdPostDaUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

// FORMATA A DATA DOS POSTS
const formatarData = (dateString) => {
  const data = new Date(dateString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// EXTRAI NOME DO AUTOR DO POST
const obterNomeAutor = (post) => {
  return post?._embedded?.author?.[0]?.name || "Autor desconhecido";
};

// OBTÉM A IMAGEM DESTACADA DO POST
const obterImagem = (post) => {
  const imagemEmbed = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  return imagemEmbed || "images/logo-acb.png";
};

// RENDERIZA O ARTIGO NA PÁGINA
function renderizarArtigo() {
  const postId = obterIdPostDaUrl();
  const postStr = localStorage.getItem("currentPost");
  const container = document.getElementById("artigo-content");
  
  if (!container) {
    console.error("❌ Container não encontrado");
    return;
  }

  if (!postStr) {
    console.warn("⚠ Post não encontrado no localStorage");
    container.innerHTML = `
      <div class="artigo-loading">
        <p style="color: #d32f2f; margin-bottom: 16px;">❌ Artigo não encontrado.</p>
        <p><a href="blog.html" style="color: #1a4fc4; text-decoration: underline;">← Voltar</a></p>
      </div>
    `;
    return;
  }

  try {
    const post = JSON.parse(postStr);
    
    // Verifica se o ID do post corresponde
    if (post.id.toString() !== postId) {
      console.warn("⚠ ID do post não corresponde");
    }

    const titulo = post.title?.rendered || "Sem título";
    const autor = obterNomeAutor(post);
    const data = formatarData(post.date);
    const imagem = obterImagem(post);
    const conteudo = post.content?.rendered || "<p>Conteúdo não disponível.</p>";
    const tag = post.categories?.includes(20) ? "Artigo" : "Newsletter";

    document.title = `${titulo} - ACBrasil`;

    const html = `
      <div class="artigo-header">
        <span class="artigo-tag">${tag}</span>
        <h1>${titulo}</h1>
        <div class="artigo-meta">
          <span class="artigo-meta-item">
            <strong>Por:</strong> ${autor}
          </span>
          <span class="artigo-meta-item">
            <strong>Data:</strong> ${data}
          </span>
        </div>
      </div>

      <img src="${imagem}" alt="${titulo}" class="artigo-featured-img">

      <div class="artigo-content">
        ${conteudo}
      </div>
    `;

    container.innerHTML = html;
    console.log("✓ Artigo renderizado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao processar post:", error);
    container.innerHTML = `
      <div class="artigo-loading">
        <p style="color: #d32f2f;">❌ Erro ao carregar artigo.</p>
        <p><a href="blog.html" style="color: #1a4fc4;">← Voltar</a></p>
      </div>
    `;
  }
}

// CONFIGURA O BOTÃO DE VOLTAR
function configurarBotaoVoltar() {
  const btnVoltar = document.querySelector(".btn-voltar");
  if (!btnVoltar) return;

  btnVoltar.addEventListener("click", () => {
    localStorage.removeItem("currentPost");
    window.location.href = "blog.html";
  });

  // Tecla Escape para voltar
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      btnVoltar.click();
    }
  });
}

// INICIALIZA QUANDO A PÁGINA ESTIVER PRONTA
if (document.readyState === 'loading') {
  console.log("⏳ Aguardando DOMContentLoaded...");
  document.addEventListener("DOMContentLoaded", () => {
    console.log("✓ DOMContentLoaded disparado");
    renderizarArtigo();
    configurarBotaoVoltar();
  });
} else {
  console.log("✓ DOM já está pronto, executando...");
  renderizarArtigo();
  configurarBotaoVoltar();
}
