import { API_BASE_URL } from "./client.js";

const WP_POSTS_ENDPOINT = `${API_BASE_URL}/wp/v2/posts`;

const construirUrlPosts = ({ page, perPage, embed }) => {
    const params = new URLSearchParams({
        per_page: String(perPage),
        page: String(page),
    });

    if (embed) {
        params.set("_embed", "1");
    }

    return `${WP_POSTS_ENDPOINT}?${params.toString()}`;
};

const buscarPagina = async ({ page, perPage, embed }) => {
    const response = await fetch(construirUrlPosts({ page, perPage, embed }));

    if (!response.ok) {
        throw new Error(
            `Erro ao consultar WordPress (status ${response.status})`,
        );
    }

    const items = await response.json();
    const totalPages = Number(response.headers.get("X-WP-TotalPages") || "1");

    return {
        items,
        totalPages,
    };
};

export const getAllPosts = async ({ perPage = 100, embed = true } = {}) => {
    const primeiraPagina = await buscarPagina({
        page: 1,
        perPage,
        embed,
    });

    let posts = primeiraPagina.items;

    if (primeiraPagina.totalPages > 1) {
        const requisicoes = [];

        for (let page = 2; page <= primeiraPagina.totalPages; page += 1) {
            requisicoes.push(buscarPagina({ page, perPage, embed }));
        }

        const paginasRestantes = await Promise.all(requisicoes);
        paginasRestantes.forEach(({ items }) => {
            posts = posts.concat(items);
        });
    }

    return posts;
};

export const getPostById = async (id, { embed = true } = {}) => {
    const params = new URLSearchParams();
    if (embed) {
        params.set("_embed", "1");
    }

    const url = `${WP_POSTS_ENDPOINT}/${id}${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Erro ao consultar post ${id} (status ${response.status})`,
        );
    }

    return response.json();
};
