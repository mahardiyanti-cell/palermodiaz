import TelegramBot from "node-telegram-bot-api";
import yahooFinance from "yahoo-finance2";
import OpenAI from "openai";

// ===== INIT =====
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== GET DATA SAHAM =====
async function getStockData(symbol) {
  try {
    const data = await yahooFinance.quote(symbol + ".JK");
    return data;
  } catch (err) {
    return null;
  }
}

// ===== ANALISA SAHAM =====
async function analyzeStock(symbol) {
  const data = await getStockData(symbol);

  if (!data || !data.regularMarketPrice) {
    return "❌ Data saham tidak ditemukan";
  }

  const prompt = `
Analisa saham ${symbol}

Harga: ${data.regularMarketPrice}
High: ${data.regularMarketDayHigh}
Low: ${data.regularMarketDayLow}

Buat analisa:
- Trend (bullish/bearish)
- Support & resistance
- Rekomendasi (BUY / WAIT / SELL)
- Target profit (%)
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content;
}

// ===== TELEGRAM HANDLER =====
bot.onText(/\/saham (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const symbol = match[1].toUpperCase();

  bot.sendMessage(chatId, "📊 Analisa saham...");

  try {
    const result = await analyzeStock(symbol);
    bot.sendMessage(chatId, result);
  } catch (err) {
    bot.sendMessage(chatId, "❌ Error saat analisa");
  }
});

// ===== START =====
console.log("🚀 Bot jalan...");
