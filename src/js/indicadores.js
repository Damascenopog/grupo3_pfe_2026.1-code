import { CDI, IPCA, SELIC, USDBRL, POUPANCA } from "../api/indicatorsApi.js";

function formatDecimal(value, fractionDigits = 2) {
    const number = Number(String(value).replace(",", "."));
    if (Number.isNaN(number)) return "--";
    return number.toLocaleString("pt-BR", {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    });
}

function formatMoney(value) {
    const number = Number(String(value).replace(",", "."));
    if (Number.isNaN(number)) return "--";
    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Falha ao carregar indicador: ${response.status}`);
    }
    return response.json();
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function setChange(id, value, direction = "neutral") {
    const element = document.getElementById(id);
    if (!element) return;

    element.textContent = value;
    element.classList.remove(
        "up",
        "down",
        "neutral",
        "is-positive",
        "is-negative",
    );

    if (direction === "positive") {
        element.classList.add("up", "is-positive");
    } else if (direction === "negative") {
        element.classList.add("down", "is-negative");
    } else {
        element.classList.add("neutral");
    }
}

function hideSpinner(id) {
    const spinner = document.getElementById(id);
    if (spinner) spinner.classList.add("is-hidden");
}

function hideAllSpinners() {
    [
        "ibov-spinner",
        "cdi-spinner",
        "ipca-spinner",
        "usdbrl-spinner",
        "selic-spinner",
    ].forEach(hideSpinner);
}

function showErrorFallback() {
    setText("ibov-value", "--");
    setChange("ibov-change", "Indisponível");
    setText("cdi-value", "--");
    setChange("cdi-change", "Indisponível");
    setText("ipca-value", "--");
    setChange("ipca-change", "Indisponível");
    setText("usdbrl-value", "--");
    setChange("usdbrl-change", "Indisponível");
    setText("selic-value", "--");
    setChange("selic-change", "Indisponível");
}

function removeIdsFromClone(element) {
    element.removeAttribute("id");
    element.querySelectorAll("[id]").forEach((child) => child.removeAttribute("id"));
}

function setupIndicadoresCarousel(grid) {
    if (!grid || grid.dataset.carouselReady === "true") return;

    const scroller = grid.closest(".indicadores-wrap") || grid;
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    let frameId = null;
    let paused = false;
    let active = false;
    let offset = 0;

    const getOriginalCards = () =>
        Array.from(grid.children).filter(
            (item) => item.dataset.carouselClone !== "true",
        );

    const getOriginalWidth = () => {
        const originals = getOriginalCards();
        if (!originals.length) return 0;

        const first = originals[0];
        const last = originals[originals.length - 1];
        return last.offsetLeft + last.offsetWidth - first.offsetLeft;
    };

    const removeClones = () => {
        grid
            .querySelectorAll('[data-carousel-clone="true"]')
            .forEach((item) => item.remove());
    };

    const addClones = () => {
        if (grid.querySelector('[data-carousel-clone="true"]')) return;

        getOriginalCards().forEach((item) => {
            const clone = item.cloneNode(true);
            clone.dataset.carouselClone = "true";
            clone.setAttribute("aria-hidden", "true");
            removeIdsFromClone(clone);
            grid.appendChild(clone);
        });
    };

    const stop = () => {
        active = false;
        if (frameId) cancelAnimationFrame(frameId);
        frameId = null;
        removeClones();
        offset = 0;
        grid.style.transform = "";
        grid.classList.remove("is-carousel-running", "is-carousel-paused");
    };

    const tick = () => {
        if (!active) return;

        if (!paused) {
            const originalWidth = getOriginalWidth();
            offset += 0.45;

            if (originalWidth && offset >= originalWidth) {
                offset = 0;
            }

            grid.style.transform = `translateX(-${offset}px)`;
        }

        frameId = requestAnimationFrame(tick);
    };

    const start = () => {
        if (!mediaQuery.matches) {
            stop();
            return;
        }

        addClones();
        active = true;
        paused = false;
        offset = 0;
        grid.style.transform = "translateX(0)";
        grid.classList.add("is-carousel-running");
        grid.classList.remove("is-carousel-paused");

        if (!frameId) frameId = requestAnimationFrame(tick);
    };

    const togglePause = () => {
        if (!mediaQuery.matches) return;
        paused = !paused;
        grid.classList.toggle("is-carousel-paused", paused);
    };

    scroller.addEventListener("click", togglePause);

    const handleMediaChange = () => {
        if (mediaQuery.matches) start();
        else stop();
    };

    if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", handleMediaChange);
    } else if (typeof mediaQuery.addListener === "function") {
        mediaQuery.addListener(handleMediaChange);
    }

    grid.dataset.carouselReady = "true";
    start();
}

export async function init() {
    const grid = document.getElementById("indicadores-grid");
    if (!grid) return;
    setupIndicadoresCarousel(grid);

    try {
        const [poupancaRes, cdiRes, ipcaRes, selicRes, usdRes] =
            await Promise.all([
                fetchJson(POUPANCA),
                fetchJson(CDI),
                fetchJson(IPCA),
                fetchJson(SELIC),
                fetchJson(USDBRL),
            ]);

        const poupancaItem = Array.isArray(poupancaRes) ? poupancaRes[0] : null;
        const cdiItem = Array.isArray(cdiRes) ? cdiRes[0] : null;
        const ipcaItem = Array.isArray(ipcaRes) ? ipcaRes[0] : null;
        const selicItem = Array.isArray(selicRes) ? selicRes[0] : null;
        const usdItem = usdRes && usdRes.USDBRL ? usdRes.USDBRL : null;

        if (poupancaItem) {
            setText("ibov-value", `${formatDecimal(poupancaItem.valor)}%`);
            setChange("ibov-change", `Último dado: ${poupancaItem.data}`);
            hideSpinner("ibov-spinner");
        }

        if (cdiItem) {
            setText("cdi-value", `${formatDecimal(cdiItem.valor)}%`);
            setChange("cdi-change", "taxa média");
            hideSpinner("cdi-spinner");
        }

        if (ipcaItem) {
            setText("ipca-value", `${formatDecimal(ipcaItem.valor)}%`);
            setChange("ipca-change", "acumulado");
            hideSpinner("ipca-spinner");
        }

        if (usdItem) {
            setText("usdbrl-value", formatMoney(usdItem.bid));
            const usdChange = Number(
                String(usdItem.pctChange).replace(",", "."),
            );
            const usdDirection = Number.isNaN(usdChange)
                ? "neutral"
                : usdChange > 0
                  ? "positive"
                  : usdChange < 0
                    ? "negative"
                    : "neutral";
            setChange(
                "usdbrl-change",
                `${formatDecimal(usdItem.pctChange)}%`,
                usdDirection,
            );
            hideSpinner("usdbrl-spinner");
        }

        if (selicItem) {
            setText("selic-value", `${formatDecimal(selicItem.valor)}%`);
            setChange("selic-change", "ao ano");
            hideSpinner("selic-spinner");
        }
    } catch (error) {
        console.error("Erro ao carregar indicadores:", error);
        showErrorFallback();
    } finally {
        hideAllSpinners();
    }
}

export default { init };
