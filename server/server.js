const express = require('express');
const puppeteer = require('puppeteer');
const cron = require('node-cron');
const axios = require('axios');

require('dotenv').config();

const app = express();
const api = axios.create({
  baseURL: process.env.TELEGRAM_BASE
});

const targetWord = ['smart tv'];
let titlesScrapped = [];
// const openNewTab = { button: 'middle' };

// const task = cron.schedule('30 * * * * *', async () => {
//   console.log('⏳ Cron Running...')
//   await getOffers()
// })

// task.start()

async function getOffers() {
  const offers = [];

  const browser = await puppeteer.launch();
  const context = browser.defaultBrowserContext();
  context.overridePermissions(process.env.TARGET_URL, ['clipboard-read']);
  const page = await browser.newPage();
  await page.goto(process.env.TARGET_URL);

  const cards = await page.$$('.card-col');

  const cardsPromises = cards.map(async (card, index) => {
    return new Promise(async (res, rej) => {
      const title = await card.$eval('.offer-title', (el) => el.textContent);

      if (
        targetWord.some((word) =>
          title.toLocaleUpperCase().includes(word.toLocaleUpperCase())
        )
      ) {
        if (titlesScrapped.some((titleScrapped) => titleScrapped === title)) {
          res();
          return;
        }

        console.log('💸 Oferta encontrada!');
        titlesScrapped.push(title);
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
          await page.waitForTimeout(1000);
          const button = await page.$('#cupon-to-store');
          await button.click();
          await page.waitForTimeout(1000);

          const cupon = await page.evaluate(
            async () => await navigator.clipboard.readText()
          );
          console.log(cupon);
          await page.waitForTimeout(2000);

          const pages = await browser.pages();

          const lastIndex = pages.length - 1
          const link = pages[lastIndex].url();
          const queryParams = new URLSearchParams(link);

          const offer = {
            title,
            previousPrice,
            offerPrice,
            paymentFormat,
            link,
            queryParams,
            cupon
          };
          offers.push(offer);

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
  return offers
}

app.get('/', async (req, res) => {
  console.log('📩 Request received!');

  try {
    const offers = await getOffers();
    const telegramMessagePromise = offers.forEach(async (offer) => {

      function createHtmlToMessage(offer) {
        const html = `
        <b>🤑 ${offer.title}</b>

        <i><s>${offer.previousPrice}</s></i>
        <b>${offer.offerPrice}</b>
        ${offer.paymentFormat} ${offer.cupon ? `<b>CUPOM: ${offer.cupon}</b>` : ''}

        <a href="${offer.link}"><b>➡️ Clique aqui para acessar a promoção!</b></a>
        `
        return html.toString()
      }

      return new Promise(async (res, rej) => {
        try {
          const htmlTextMessage = createHtmlToMessage(offer)
          console.log(htmlTextMessage)

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

    res.send('Procedimento completo');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `👂 Server App running... listening at http://localhost:${process.env.PORT}`
  );
});
