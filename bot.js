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
    const userId = ctx.from.id;
    const text = ctx.message.text;

    // ambil user dari DB
    let user = await User.findOne({ userId });

    // simpan nama
    if (text.toLowerCase().includes("nama saya")) {
      const name = text.split("nama saya")[1]?.trim();

      if (name) {
        if (!user) {
          user = new User({ userId, name });
        } else {
          user.name = name;
        }

        await user.save();
        return ctx.reply("Oke saya simpan di database 😎");
      }
    }

    if (!chats[userId]) chats[userId] = [];

    chats[userId].push({
      role: "user",
      content: text,
    });

    const messages = [
      {
        role: "system",
        content: `Kamu asisten santai dan ramah. Panggil user dengan nama ${user?.name || "teman"}`
      },
      ...chats[userId],
    ];

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    const reply = res.choices[0].message.content;

    chats[userId].push({
      role: "assistant",
      content: reply,
    });

    ctx.reply(reply);
  } catch (err) {
    console.log(err);
    ctx.reply("Error 😅");
  }
});

bot.launch();
console.log("Bot PRO jalan 🚀");
