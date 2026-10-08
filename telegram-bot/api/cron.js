const { Telegram } = require('telegraf');
const { kv } = require('@vercel/kv');

const telegram = new Telegram(process.env.BOT_TOKEN);

module.exports = async (req, res) => {
    try {
        // Veritabanındaki tüm kullanıcıları bul
        const keys = await kv.keys('user_*');
        const suAn = Date.now();

        for (let key of keys) {
            const bitisZamani = await kv.get(key);

            // Eğer kaydedilen zaman şu anki zamana eşit veya geçmişse
            if (suAn >= bitisZamani) {
                const userId = key.split('_')[1];

                // Mesajı Gönder
                await telegram.sendMessage(
                    userId,
                    "🚨 Hey! 1 saat doldu. Tıklama zamanı geldi, oyuna gir!"
                );

                // Gönderdikten sonra veritabanından sil (tekrar atmasın)
                await kv.del(key);
            }
        }

        res.status(200).send('Zamanlayici kontrol edildi.');
    } catch (error) {
        console.error("Cron hatası:", error);
        res.status(500).send('Cron hatası');
    }
};
