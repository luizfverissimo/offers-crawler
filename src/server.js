const express = require('express');

require('dotenv').config();
require('./services/firebase');

const getOffers = require('./getOffers');
const sendTelegramMessage = require('./sendTelegramMessage');
const sendTelegramLogs = require('./sendTelegramLogs');

const channelGroups = require('../channelGroups.json');
const task = require('./cron/jobs');

const app = express();

task.start();

const { macOfertas, promoTools,  gamerOffers} = channelGroups;

app.get('/', async (req, res) => {
  console.log('📩 Request received!');

  //macOfertas
  await processOffers(macOfertas);
  //PromoTools
  await processOffers(promoTools);
  //gamerOffers
  await processOffers(gamerOffers);

  console.log('🔎 Awaiting to search more offers!')

  res.send('Procedimento completo');
});

async function processOffers(channel) {
  const offers = await getOffers(channel);

  if (offers.length === 0) {
    console.log(channel.firebaseCollection + '- 😭 Sem ofertas - tente novamente!');
    sendTelegramLogs(channel.firebaseCollection + '- 😭 Sem ofertas - tente novamente!');
  }

  await sendTelegramMessage(offers, channel.chatId);
  return
}

app.listen(process.env.PORT, () => {
  console.log(
    `👂 Server App running... listening at http://localhost:${
      process.env.PORT || '3000'
    }`
  );
});
