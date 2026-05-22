import { fundadores } from "./dados-membros.js";

const getImagem = (relativePath) => new URL(relativePath, import.meta.url).href;

const limitarTexto = (texto, limite) => {
    if (!texto) return "";
    if (texto.length <= limite) return texto;

    const recorte = texto.slice(0, limite).trim();
    return `${recorte.replace(/\s+\S*$/, "")}...`;
};

const criarCardFundador = (fundador) => {
    const imagem = getImagem(fundador.foto);
    const descricaoCurta = limitarTexto(fundador.descricao, 165);
    const linkDetalhe = `fundador.html?id=${fundador.id}`;

    return `
		<article class="fundador-card">
			<div class="fundador-card__media">
				<img src="${imagem}" alt="${fundador.nome}" loading="lazy">
			</div>
			<div class="fundador-card__body">
				<h3 class="fundador-card__name">${fundador.nome}</h3>
				<p class="fundador-card__excerpt">${descricaoCurta}</p>
				<div class="fundador-card__footer">
					<a class="fundador-card__link" href="${linkDetalhe}">ver mais</a>
				</div>
			</div>
		</article>
	`;
};

const renderizarFundadores = (container) => {
    if (!container) return;

    if (!fundadores.length) {
        container.innerHTML = `
			<div class="fundadores-empty">
				Nenhum associado fundador foi encontrado no momento.
			</div>
		`;
        return;
    }

    container.innerHTML = fundadores.map(criarCardFundador).join("");
};

const criarDetalheFundador = (fundador) => {
    const imagem = getImagem(fundador.foto);

    return `
		<article class="fundador-detalhe-card">
			<div class="fundador-detalhe-media">
				<img src="${imagem}" alt="${fundador.nome}">
			</div>
			<div class="fundador-detalhe-content">
				<span class="fundador-detalhe-kicker">Associado fundador</span>
				<h1>${fundador.nome}</h1>
				<p>${fundador.descricao}</p>
				<div class="fundador-detalhe-actions">
					<a class="fundador-back-link" href="quemsomos.html#fundadores">Voltar para os fundadores</a>
				</div>
			</div>
		</article>
	`;
};

const renderizarDetalheFundador = (container) => {
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const fundador = fundadores.find((item) => item.id === id);

    if (!fundador) {
        container.innerHTML = `
			<div class="fundador-detail-empty">
				Associado fundador não encontrado. Volte para a página de quem somos e escolha outro card.
			</div>
		`;
        return;
    }

    document.title = `${fundador.nome} | ACBrasil`;
    container.innerHTML = criarDetalheFundador(fundador);
};

const initQuemSomos = () => {
    const gridFundadores = document.getElementById("fundadores-grid");
    const detalheFundador = document.getElementById("fundador-detail");

    renderizarFundadores(gridFundadores);
    renderizarDetalheFundador(detalheFundador);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initQuemSomos, {
        once: true,
    });
} else {
    initQuemSomos();
}
