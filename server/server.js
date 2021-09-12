const express = require('express');
const puppeteer = require('puppeteer');
const cron = require('node-cron');

require('dotenv').config();

const app = express();

const targetWord = ['SMART TV', 'SMARTPHONE'];
let titlesScrapped = []
// const openNewTab = { button: 'middle' };

const task = cron.schedule('30 * * * * *', async () => {
  console.log('⏳ Cron Running...')
  await getOffers()
})

task.start()

async function getOffers() {
  const offers = [];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(process.env.TARGET_URL);

  const cards = await page.$$('.card-col');

  const cardsPromises = cards.map(async (card, index) => {
    return new Promise(async (res, rej) => {
      const title = await card.$eval('.offer-title', (el) => el.textContent);

      if (targetWord.some((word) => title.toLocaleUpperCase().includes(word))) {
        if (titlesScrapped.some(titleScrapped => titleScrapped === title)) {
          res()
          return
        }

        console.log('💸 Oferta encontrada!');
        titlesScrapped.push(title)
        const offerPrice = await card.$eval(
          '.offer-card-price',
          (el) => el.textContent
        );

        let previousPrice = '';
        let paymentFormat = '';
        try {
          previousPrice = await card.$eval(
            '.offer-previous-price',
            (el) => el.textContent
          );
          paymentFormat = await card.$eval(
            '.offer-payment-format',
            (el) => el.textContent
          );
        } catch (err) {
          console.log('Sem dados de preço anterior e/ou forma de pagamento.');
        }

        const internalLink = await card.$eval('.offer-go-to-store', (el) =>
          el.getAttribute('href')
        );

        if (internalLink === 'javascript:undefined') {
          console.log('oferta com cupom!');
          const linkButton = await card.$('.offer-go-to-store');

          await linkButton.click();
          const code = await page.$eval('#cupon_code', (el) =>
            el.getAttribute('value')
          );

          console.log(code);

          res();
          return;
        }

        const offerPage = await browser.newPage();
        offerPage.goto(`${process.env.URL_BASE}${internalLink}`);
        await offerPage.waitForNavigation({ waitUntil: 'load' });

        const link = await offerPage.url();
        const queryParams = new URLSearchParams(link);

        const offer = {
          title,
          previousPrice,
          offerPrice,
          paymentFormat,
          link,
          queryParams
        };
        offers.push(offer);
      }
      res();
    });
  });

  await Promise.all(cardsPromises);

  if (offers.length === 0) {
    console.log('😭 Sem ofertas - tente novamente!');
  }

  console.log(offers);

  await browser.close();
}

app.get('/', async (req, res) => {
  console.log('📩 Request received!');

  try {
    await getOffers();
    res.send('Procedimento completo');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`👂 Server App running... listening at http://localhost:${process.env.PORT}`);
});
