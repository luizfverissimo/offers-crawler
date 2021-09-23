const express = require('express');

require('dotenv').config();
require('./services/firebase')

const getOffers = require('./getOffers');
const sendTelegramMessage = require('./sendTelegramMessage')
const task = require('./cron/jobs')

const app = express();

const targetWords = ['iphone', 'macbook', 'mac mini', 'macmini', 'imac'];

task.start()

app.get('/', async (req, res) => {
  console.log('📩 Request received!');

    const offers = await getOffers(targetWords);

    if (offers.length === 0) {
      console.log('😭 Sem ofertas - tente novamente!');
      res.send('Procedimento completo');
      return;
    }

    await sendTelegramMessage(offers)

    res.send('Procedimento completo');
});

app.listen(process.env.PORT, () => {
  console.log(
    `👂 Server App running... listening at http://localhost:${process.env.PORT || '3000'}`
  );
});
