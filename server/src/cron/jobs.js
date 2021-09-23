const cron = require('node-cron');

const getOffers = require('../getOffers');
const sendTelegramMessage = require('../sendTelegramMessage')

const targetWords = ['iphone', 'macbook', 'mac mini', 'macmini', 'imac'];

const task = cron.schedule('5 * * * *', async () => {
  console.log('⏳ Cron Running...')
  await sendTelegramLogs('⏳ Cron Running...')
  const offers = await getOffers(targetWords);

  if (offers.length === 0) {
    console.log('😭 Sem ofertas - tente novamente!');
    res.send('Procedimento completo');
    return;
  }

  await sendTelegramMessage(offers)
})

module.exports = task
