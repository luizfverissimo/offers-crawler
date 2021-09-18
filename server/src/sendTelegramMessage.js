const api = require('./utils/api')

function createHtmlToMessage(offer) {
  const html = `
        <b>🤑 ${offer.title}</b>

        <i><s>${offer.previousPrice}</s></i>
        <b>${offer.offerPrice}</b>
        ${offer.paymentFormat} ${offer.cupon ? `<b>CUPOM: ${offer.cupon}</b>` : ''}

        <a href="${offer.link}"><b>➡️ Clique aqui para acessar a promoção!</b></a>
        `;
  return html.toString();
}

async function sendTelegramMessage(offers) {
  const telegramMessagePromise = offers.forEach(async (offer) => {
    return new Promise(async (res, rej) => {
      try {
        const htmlTextMessage = createHtmlToMessage(offer);

        await api.post('/sendMessage', {
          chat_id: '1140207293',
          text: htmlTextMessage,
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

  await Promise.all(telegramMessagePromise);
}

module.exports = sendTelegramMessage