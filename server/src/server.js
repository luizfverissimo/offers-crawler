const express = require('express');
const cron = require('node-cron');

require('dotenv').config();

const getOffers = require('./getOffers');
const sendTelegramMessage = require('./sendTelegramMessage')

const app = express();

// const task = cron.schedule('30 * * * * *', async () => {
//   console.log('⏳ Cron Running...')
//   await getOffers()
// })

// task.start()s

const targetWords = ['notebook'];

app.get('/', async (req, res) => {
  console.log('📩 Request received!');

  try {
    const offers = await getOffers(targetWords);

    if (offers.length === 0) {
      console.log('😭 Sem ofertas - tente novamente!');
      res.send('Procedimento completo');
      return;
    }

    await sendTelegramMessage(offers)

    res.send('Procedimento completo');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `👂 Server App running... listening at http://localhost:${process.env.PORT || '3000'}`
  );
});