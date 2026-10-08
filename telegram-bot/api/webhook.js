
import { Telegraf } from 'telegraf';
import { kv } from '@vercel/kv';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply(
    'Merhaba! 1 saatlik hatırlatıcı kurmak için /hatirlat yazabilirsin.'
  );
});

bot.command('hatirlat', async (ctx) => {
  const userId = ctx.from.id;
  const bitisZamani = Date.now() + 60 * 60 * 1000;

  await kv.set(`user_${userId}`, bitisZamani);

  await ctx.reply(
    '✅ Zamanlayıcı kuruldu! Tam 1 saat sonra sana mesaj atacağım.'
  );
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      message: 'Webhook endpoint aktif.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    await bot.handleUpdate(req.body);
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook hatası:', error);
    return res.status(500).send('Webhook hatası');
  }
}
