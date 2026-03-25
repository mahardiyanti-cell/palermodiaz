require("dotenv").config();

const { Telegraf } = require("telegraf");
const OpenAI = require("openai");
const mongoose = require("mongoose");
const User = require("./user");

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🔥"))
  .catch(err => console.log(err));

// init bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// init openai
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chats = {};

bot.start((ctx) => {
  ctx.reply("Halo! Saya AI bot PRO 🤖🔥");
});

bot.on("text", async (ctx) => {
  try {
    const userMessage = ctx.message.text;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Kamu adalah AI assistant yang ramah." },
        { role: "user", content: userMessage }
      ],
    });

    const reply = response.choices[0].message.content;

    await ctx.reply(reply);

  } catch (error) {
    console.error("ERROR:", error);
    await ctx.reply("Error 😅: " + error.message);
  }
});

bot.launch();
console.log("Bot PRO jalan 🚀");
