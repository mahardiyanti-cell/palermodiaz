require('dotenv').config();
console.log("TOKEN:", process.env.BOT_TOKEN);
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toUpperCase();

  if (text === '/START') {
    return bot.sendMessage(chatId, 'Kirim kode saham (contoh: BBRI)');
  }

  try {
  bot.sendMessage(chatId, '📊 Sedang analisa saham...');

  const symbol = text + '.JK';

  const response = await axios.get(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_API_KEY}`
  );

  const data = response.data["Global Quote"];

  if (!data || !data["05. price"]) {
    return bot.sendMessage(chatId, '❌ Data saham tidak ditemukan');
  }

  const result = `
📊 ${symbol}
💰 Harga: ${data["05. price"]}
📈 High: ${data["03. high"]}
📉 Low: ${data["04. low"]}
`;

  bot.sendMessage(chatId, result);

} catch (err) {
  console.log("ERROR:", err);
  bot.sendMessage(chatId, '❌ Error ambil data saham');
}
});
