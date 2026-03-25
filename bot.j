const { Telegraf } = require('telegraf');
const axios = require('axios');
const bot = new Telegraf(8739020805:AAEahRFVnbuj6pUMyLIfIosRl0Cx3S-OcY0)
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('Halo! Saya AI bot siap bantu 😎'));

bot.on('text', async (ctx) => {
  try {
    const res = await axios.post(
      'http://127.0.0.1:18789/v1/chat/completions',
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "Kamu adalah asisten yang membantu dan santai." },
          { role: "user", content: ctx.message.text }
        ]
      }
    );

    const reply = res.data.choices[0].message.content;
    await ctx.reply(reply);

  } catch (err) {
    console.log(err.message);
    ctx.reply("Error koneksi ke AI 😅");
  }
});

bot.launch();
