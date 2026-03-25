require('dotenv').config();

const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const User = require('./db');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

bot.start((ctx) => ctx.reply('Halo! Saya AI bot siap bantu 😎'));

bot.on('text', async (ctx) => {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: const userId = ctx.from.id;

if (!global.chatHistory) global.chatHistory = {};

if (!global.chatHistory[userId]) {
  global.chatHistory[userId] = [
    { role: "system", content: "Kamu adalah AI assistant pintar, ramah, dan membantu." }
  ];
}

global.chatHistory[userId].push({
  role: "user",
  content: ctx.message.text
});

const res = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: global.chatHistory[userId]
});

const reply = res.choices[0].message.content;

global.chatHistory[userId].push({
  role: "assistant",
  content: reply
});

await ctx.reply(reply);

    });

    const reply = res.choices[0].message.content
    await ctx.reply(reply);

  } catch (err) {
    console.log(err)
    ctx.reply("Error koneksi ke AI 😅");
  }
});

bot.launch();

console.log("Bot jalan 🚀")
