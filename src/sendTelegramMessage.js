const api = require('./utils/api')

function createHtmlToMessage(offer) {
  const html = `
<b>🚨 ${offer.title}</b>

    <i>❌ <s>${offer.previousPrice}</s></i>
    <b>✅ ${offer.offerPrice}</b>
    📋 ${offer.paymentFormat}

${offer.coupon ? `<b>🎟 CUPOM: ${offer.coupon}</b>` : ''}

<b>➡️ Acesse: ${offer.link}</b>
`;
  return html.toString();
}

async function sendTelegramMessage(offers) {
  const telegramMessagePromise = offers.forEach(async (offer) => {
    return new Promise(async (res, rej) => {
      try {
        const htmlTextMessage = createHtmlToMessage(offer);

        await api.post('/sendPhoto', {
          chat_id: process.env.TELEGRAM_CHAT_ID,
          photo: offer.imageLink,
          caption: htmlTextMessage,
          parse_mode: 'HTML'
        });
        console.log('🤖 Bot message was send!');
        return res();
      } catch (err) {
        console.log('🤖 Bot message Error! ⛔️');
        console.log(err);
        return rej();
      }
    });
  });

  return telegramMessagePromise
}

module.exports = sendTelegramMessage