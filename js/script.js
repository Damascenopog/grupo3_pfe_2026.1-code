import { fetchPosts } from "./api/posts.js";
import { artigo, renderizarPostsNoContainer } from "./pages/blog.js";

// REFERÊNCIAS AOS ELEMENTOS DO HTML ONDE O CONTEÚDO SERÁ INSERIDO OU ATUALIZADO
const blogGrid = document.getElementById("blog-grid");

// FUNÇÃO CRIADA PARA RECEBER AS PROPRIEDADES DO POST E EXIBIR NO CARD (COMPATÍVEL COM A HOME: USA #blog-grid)
const renderizarBlog = (posts) => {
  renderizarPostsNoContainer(blogGrid, posts);
};

// PONTO DE ENTRADA AO CARREGAR O SCRIPT: USA async/await PARA AGUARDAR A API
(async () => {
  if (!blogGrid) return;

  const posts = await fetchPosts();
  if (!posts?.length) {
    renderizarPostsNoContainer(blogGrid, []);
    return;
  }

  // HOME (OU OUTRAS PÁGINAS COM #blog-grid): APENAS OS QUATRO ARTIGOS MAIS RECENTES
  const artigosRecentes = posts.filter(artigo).slice(0, 4);
  renderizarBlog(artigosRecentes);
})();

const baseUrl = 'https://acbrasil.org.br/cms/wp-json/wp/v2';
const endpoints = ['associados', 'membros', 'equipe', 'users', 'associado', 'membro'];

endpoints.forEach(async (route) => {
    try {
        const res = await fetch(`${baseUrl}/${route}`);
        if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
                console.log(`✅ SUCESSO! O endpoint correto é: /${route}`);
                console.log(`Inspecione o objeto do primeiro associado retornado:`, data[0]);
            }
        }
    } catch (e) {
        // Ignora erros de rotas inexistentes
    }
});