const api = require('./utils/api')

async function sendTelegramLogs(log) {
    return new Promise(async (res, rej) => {
      try {
        await api.post('/sendMessage', {
          chat_id: process.env.TELEGRAM_LOG_ID,
          text: log,
          parse_mode: 'HTML'
        });
        console.log('⚙️ Logs was send!');
        return res();
      } catch (err) {
        console.log('⚙️ Logs error! ⛔️');
        console.log(err);
        return rej();
      }
    });
}

module.exports = sendTelegramLogs