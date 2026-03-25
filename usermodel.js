require('dotenv').config();
const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const mongoose = require('mongoose');
const User = require('./userModel');

// INIT BOT
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// INIT OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// CONNECT DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🔥"))
  .catch(err => console.log(err));

// START COMMAND
bot.start(async (ctx) => {
  ctx.reply("Halo! Saya AI bot PRO 🤖\nKetik apa saja ya!");
});

// RESET MEMORY
bot.command('reset', async (ctx) => {
  const userId = ctx.from.id.toString();
  await User.findOneAndUpdate(
    { userId },
    { messages: [] }
  );
  ctx.reply("Memory kamu sudah di-reset 🧹");
});

// MAIN CHAT
bot.on('text', async (ctx) => {
  try {
    const userId = ctx.from.id.toString();
    const text = ctx.message.text;

    // ambil user dari DB
    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({
        userId,
        name: "",
        messages: []
      });
    }

    // DETEKSI NAMA
    if (text.toLowerCase().includes("nama saya")) {
      const name = text.split("nama saya")[1].trim();
      user.name = name;
      await user.save();
      return ctx.reply(`Oke ${name}, saya ingat 😎`);
    }

    // SYSTEM PROMPT
    const messages = [
      {
        role: "system",
        content: `Kamu asisten santai dan ramah. Panggil user dengan nama ${user.name || "teman"}`
      },
      ...user.messages,
      { role: "user", content: text }
    ];

    // REQUEST AI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    const reply = response.choices[0].message.content;

    // SIMPAN HISTORY
    user.messages.push({ role: "user", content: text });
    user.messages.push({ role: "assistant", content: reply });

    // BATASI HISTORY (biar ringan)
    if (user.messages.length > 20) {
      user.messages = user.messages.slice(-20);
    }

    await user.save();

    ctx.reply(reply);

  } catch (error) {
    console.log(error);
    ctx.reply("Terjadi error 😢 coba lagi ya");
  }
});

// RUN BOT
bot.launch();
console.log("Bot PRO+ jalan 🚀");
