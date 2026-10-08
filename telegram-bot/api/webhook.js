const { Telegraf } = require('telegraf');
const { kv } = require('@vercel/kv');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply("Merhaba! 1 saatlik hatırlatıcı kurmak için /hatirlat yazabilirsin.");
});

bot.command('hatirlat', async (ctx) => {
    const userId = ctx.from.id;
    // Şu anki zamana tam 1 saat (3600000 milisaniye) ekliyoruz.
    // Test etmek isterseniz 1 dakika (60000) yapabilirsiniz.
    const bitisZamani = Date.now() + 3600000;

    // Veritabanına kaydediyoruz
    await kv.set(`user_${userId}`, bitisZamani);

    ctx.reply("✅ Zamanlayıcı kuruldu! Tam 1 saat sonra sana mesaj atacağım.");
});

// Vercel Serverless Function ayarı
module.exports = async (req, res) => {
    try {
        await bot.handleUpdate(req.body);
        res.status(200).send('OK');
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).send('Hata');
    }
};
