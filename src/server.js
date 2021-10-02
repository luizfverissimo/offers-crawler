const express = require('express');

require('dotenv').config();
require('./services/firebase');

const task = require('./cron/jobs');
const cleaner = require('./cron/cleanTitles');

const getOffers = require('./getOffers');
const sendTelegramMessage = require('./sendTelegramMessage');
const sendTelegramLogs = require('./sendTelegramLogs');
const cleaningTitles = require('./cron/cleanTitles');

const channelGroups = require('../channelGroups.json');

const app = express();

task.start();
cleaner.start();

const { macOfertas, smartPhoneOffers, gamerOffers, test } = channelGroups;

app.get('/', async (req, res) => {
  console.log('📩 Request received!');

  //macOfertas
  await processOffers(macOfertas);
  // //PromoTools
  await processOffers(smartPhoneOffers);
  // gamerOffers
  await processOffers(gamerOffers);
  // //test
  // await processOffers(test)

  console.log('🔎 Awaiting to search more offers!');

  res.send('Procedimento completo');
});

async function processOffers(channel) {
  const offers = await getOffers(channel);

  if (offers.length === 0) {
    console.log(
      channel.firebaseCollection + '- 😭 Sem ofertas - tente novamente!'
    );
    sendTelegramLogs(
      channel.firebaseCollection + '- 😭 Sem ofertas - tente novamente!'
    );
  }

  await sendTelegramMessage(offers, channel.chatId);
  return;
}

app.get('/test', async (req, res) => {
  await cleaningTitles(gamerOffers.lastTitlesDoc);
  res.send('limpou!');
  return;
});

app.listen(process.env.PORT, () => {
  console.log(
    `👂 Server App running... listening at http://localhost:${
      process.env.PORT || '3000'
    }`
  );
});
