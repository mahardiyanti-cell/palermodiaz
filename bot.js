require('dotenv').config();
console.log("TOKEN:", process.env.BOT_TOKEN);
const TelegramBot = require('node-telegram-bot-api');
const yahooFinance = require('yahoo-finance2').default;

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toUpperCase();

  if (text === '/START') {
    return bot.sendMessage(chatId, 'Kirim kode saham (contoh: BBRI)');
  }

  try {
    bot.sendMessage(chatId, '📊 Sedang analisa saham...');

    const data = await yahooFinance.quote(text + '.JK');

    if (!data || !data.regularMarketPrice) {
      return bot.sendMessage(chatId, '❌ Data saham tidak ditemukan');
    }

    const result = `
📊 ${data.shortName} (${text}.JK)
💰 Harga: ${data.regularMarketPrice}
📈 High: ${data.regularMarketDayHigh}
📉 Low: ${data.regularMarketDayLow}
`;

    bot.sendMessage(chatId, result);

  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, '❌ Error ambil data saham');
  }
});

