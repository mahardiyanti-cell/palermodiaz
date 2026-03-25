const yahooFinance = require("yahoo-finance2").default;

async function getStockData(symbol) {
  try {
    const data = await yahooFinance.quote(`${symbol}.JK`);

    return {
      price: data.regularMarketPrice,
      high: data.regularMarketDayHigh,
      low: data.regularMarketDayLow,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = { getStockData };
