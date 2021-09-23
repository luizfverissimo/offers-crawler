const api = require('./utils/api')

async function sendTelegramLogs(log) {
  const telegramMessagePromise = offers.forEach(async (offer) => {
    return new Promise(async (res, rej) => {
      try {
        const htmlTextMessage = createHtmlToMessage(offer);

        await api.post('/sendMessage', {
          chat_id: process.env.TELEGRAM_LOG_ID,
          text: htmlTextMessage,
        });
        console.log('⚙️ Logs was send!');
        return res();
      } catch (err) {
        console.log('⚙️ Logs was send! ⛔️');
        console.log(err);
        return rej();
      }
    });
  });

  return telegramMessagePromise
}

module.exports = sendTelegramLogs