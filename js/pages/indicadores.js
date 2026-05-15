import { getMarketQuotes } from '../api/finance';

// Seleciona os containers principais
const gridContainer = document.querySelector('.indicadores-grid');
const dataAtualizacao = document.querySelector('.mercado-update');

// Função auxiliar para formatar moeda (R$)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

// Função auxiliar para definir a cor e a seta baseada na variação percentual
const getChangeFormatting = (changeValue) => {
    if (changeValue > 0) {
        return { class: 'up', icon: '▲', text: `+${changeValue.toFixed(2).replace('.', ',')}%` };
    } else if (changeValue < 0) {
        return { class: 'down', icon: '▼', text: `${changeValue.toFixed(2).replace('.', ',')}%` };
    }
    return { class: 'neutral', icon: '', text: '0,00%' };
};

// Função pura para renderizar os cards mantendo a sua estrutura HTML
function renderIndicadores(quotes) {
    gridContainer.innerHTML = ''; // Limpa o estado de loading

    const indicadores = [
        {
            label: 'IBOV',
            value: `${quotes.ibovespa.toLocaleString('pt-BR')} pts`,
            change: quotes.ibovespaChange
        },
        {
            label: 'BTC/BRL',
            value: formatCurrency(quotes.btc),
            change: quotes.btcChange // Exige que a API retorne a variação do BTC
        },
        {
            label: 'USDT/BRL',
            value: formatCurrency(quotes.usdt),
            change: quotes.usdtChange // Exige que a API retorne a variação do USDT
        }
    ];

    // Cria o HTML exato para cada indicador e injeta no DOM
    indicadores.forEach(ind => {
        const format = getChangeFormatting(ind.change);
        
        const cardHTML = `
            <div class="indicador-card">
                <span class="indicador-label">${ind.label}</span>
                <span class="indicador-value">${ind.value}</span>
                <span class="indicador-change ${format.class}">
                    ${format.icon} ${format.text}
                </span>
            </div>
        `;
        
        gridContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// Inicialização e controle de data
async function initDashboard() {
    // Estado visual de carregamento mantendo a estrutura
    gridContainer.innerHTML = '<div class="indicador-card"><span class="indicador-label">Sincronizando mercado...</span></div>';
    
    const quotes = await getMarketQuotes();

    if (quotes) {
        renderIndicadores(quotes);
        
        // Atualiza a data do cabeçalho dinamicamente
        const hoje = new Date();
        const dataFormatada = new Intl.DateTimeFormat('pt-BR', { 
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(hoje);
        
        if(dataAtualizacao) {
            dataAtualizacao.textContent = `Dados atualizados em tempo real · ${dataFormatada}`;
        }
    } else {
        gridContainer.innerHTML = '<div class="indicador-card"><span class="indicador-label text-red">Erro ao carregar dados.</span></div>';
    }
}

// Inicia a renderização
initDashboard();