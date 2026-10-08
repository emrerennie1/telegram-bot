import { Telegram } from 'telegraf';
import { kv } from '@vercel/kv';

const telegram = new Telegram(process.env.BOT_TOKEN);

export default async function handler(req, res) {
  try {
    const keys = await kv.keys('user_*');
    const now = Date.now();

    for (const key of keys) {
      const dueAt = Number(await kv.get(key));

      if (Number.isFinite(dueAt) && now >= dueAt) {
        const userId = key.slice('user_'.length);

        await telegram.sendMessage(
          userId,
          '🚨 Hey! 1 saat doldu. Tıklama zamanı geldi, oyuna gir!'
        );

        await kv.del(key);
      }
    }

    return res.status(200).send('Zamanlayıcı kontrol edildi.');
  } catch (error) {
    console.error('Cron hatası:', error);
    return res.status(500).send('Cron hatası');
  }
}
