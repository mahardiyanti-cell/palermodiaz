const TelegramBot = require('node-telegram-bot-api');
const yahooFinance = require('yahoo-finance2').default;

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    if (!text) return;

    // START COMMAND
    if (text === '/start') {
      return bot.sendMessage(chatId, "Kirim kode saham (contoh: BBRI)");
    }

    const symbol = text.toUpperCase() + ".JK";

    await bot.sendMessage(chatId, "📊 Sedang analisa saham...");

    const data = await yahooFinance.quote(symbol);

    if (!data || !data.regularMarketPrice) {
      return bot.sendMessage(chatId, "❌ Data saham tidak ditemukan");
    }

    const response = `
📈 ${data.symbol}
Harga: ${data.regularMarketPrice}
High: ${data.regularMarketDayHigh}
Low: ${data.regularMarketDayLow}
`;

    bot.sendMessage(chatId, response);

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error bro, coba lagi...");
  }
});
