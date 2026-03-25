require("dotenv").config();

const { Telegraf } = require("telegraf");
const OpenAI = require("openai");
const { getStockData } = require("./saham");
// const mongoose = require("mongoose");
// const User = require("./user");

// connect DB
// mongoose.connect(process.env.MONGO_URI)
//  .then(() => console.log("MongoDB connected 🔥"))
//  .catch(err => console.log(err));

// init bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// init openai
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

bot.on("text", async (ctx) => {
  try {
    const symbol = ctx.message.text.toUpperCase();

    const data = await getStockData(symbol);

    if (!data) {
      return ctx.reply("❌ Saham tidak ditemukan");
    }

    const { price, high, low } = data;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `
Analisa saham ${symbol}:

Harga: ${price}
High: ${high}
Low: ${low}

Berikan:
- Trend
- Support resistance
- Saran entry
- Risiko
`
    });

    await ctx.reply(`
📊 ${symbol}

Harga: ${price}
High: ${high}
Low: ${low}

${response.output_text}
`);

  } catch (error) {
    console.error(error);
    await ctx.reply("❌ Error bot");
  }
});
  try {
    const userMessage = ctx.message.text;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: userMessage,
    });

    const reply = response.output_text || "Maaf, tidak ada respon 😅";

    await ctx.reply(reply);

  } catch (error) {
    console.error("ERROR:", error);
    await ctx.reply("Error: " + error.message);
  }
});
bot.launch();
console.log("Bot PRO jalan 🚀");
