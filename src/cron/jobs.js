const cron = require('node-cron');

const getOffers = require('../getOffers');
const sendTelegramLogs = require('../sendTelegramLogs');
const sendTelegramMessage = require('../sendTelegramMessage');

const channelGroups = require('../../channelGroups.json');


const { macOfertas, promoTools } = channelGroups;

const task = cron.schedule('*/15 * * * *', async () => {
  console.log('⏳ Cron Running...');
  sendTelegramLogs('⏳ Cron Running...');
  
  //macOfertas
  await processOffers(macOfertas)
  //PromoTools
  await processOffers(promoTools)

});

async function processOffers(channel) {
  const offers = await getOffers(channel);

  if (offers.length === 0) {
    console.log('😭 Sem ofertas - tente novamente!');
    sendTelegramLogs('😭 Sem ofertas - tente novamente!');
    return;
  }

  await sendTelegramMessage(offers, channel.chatId);
}

module.exports = task;
