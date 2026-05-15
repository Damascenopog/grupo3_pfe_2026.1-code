import { API_BASE_URL } from "./config.js";

export async function fetchPosts() {
  const postsPerPage = 100;
  const endpoint = "posts";

  try {
    const responseInicial = await fetch(
      `${API_BASE_URL}${endpoint}?per_page=${postsPerPage}&page=1&_embed=1`
    );

    if (!responseInicial.ok) {
      throw new Error(`Erro na requisição: ${responseInicial.status}`);
    }

    const totalPaginas = parseInt(
      responseInicial.headers.get("X-WP-TotalPages") || "1",
      10
    );

    let todosPosts = await responseInicial.json();

    if (totalPaginas > 1) {
      const pages = [];
      for (let i = 2; i <= totalPaginas; i++) {
        pages.push(
          fetch(`${API_BASE_URL}${endpoint}?per_page=${postsPerPage}&page=${i}&_embed=1`).then(
            (res) => res.json()
          )
        );
      }
      const pagesRestantes = await Promise.all(pages);
      pagesRestantes.forEach((paginasPosts) => {
        todosPosts = todosPosts.concat(paginasPosts);
      });
    }

    return todosPosts;
  } catch (error) {
    throw new Error(`Erro ao buscar posts: ${error.message}`);
  }
}
