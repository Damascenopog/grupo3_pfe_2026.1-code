// js/api/finance.js

// Alterado para o endpoint de 24hr para capturar a porcentagem de variação (priceChangePercent)
const BINANCE_BTC = 'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCBRL';
const BINANCE_USDT = 'https://api.binance.com/api/v3/ticker/24hr?symbol=USDTBRL';
const YAHOO_IBOV = 'https://query1.finance.yahoo.com/v8/finance/chart/^BVSP?interval=1d&range=1d'; 

export async function getMarketQuotes() {
    try {
        const [resBtc, resUsdt, resIbov] = await Promise.all([
            fetch(BINANCE_BTC), fetch(BINANCE_USDT), fetch(YAHOO_IBOV)
        ]);

        const dataBtc = await resBtc.json();
        const dataUsdt = await resUsdt.json();
        const dataIbov = await resIbov.json();
        
        const ibovMeta = dataIbov.chart.result[0].meta;
        const ibovespaPrice = ibovMeta.regularMarketPrice;
        const ibovespaChange = ((ibovespaPrice - ibovMeta.chartPreviousClose) / ibovMeta.chartPreviousClose) * 100;

        return {
            btc: parseFloat(dataBtc.lastPrice),
            btcChange: parseFloat(dataBtc.priceChangePercent), // Variação do BTC
            
            usdt: parseFloat(dataUsdt.lastPrice),
            usdtChange: parseFloat(dataUsdt.priceChangePercent), // Variação do USDT
            
            ibovespa: ibovespaPrice,
            ibovespaChange: ibovespaChange // Variação IBOV
        };
    } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
        return null;
    }
}