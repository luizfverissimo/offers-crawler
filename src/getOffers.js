const puppeteer = require('puppeteer');
const { nanoid } = require('nanoid');
const dayjs = require('dayjs');

const cleanLinkGenerator = require('./cleanLinkGenerator');
const saveFirebase = require('./saveFirebase');
const saveLastTitlesFirebase = require('./saveLastTitlesFirebase');
const getLastTitles = require('./getLastTitles');
const sendTelegramLogs = require('./sendTelegramLogs');
const changeTitle = require('./utils/changeTitle');

let titlesScrapped = [];
// let lastTitlesScraped = [];

async function getOffers(channel) {
  const { targetWords, lastTitlesDoc, firebaseCollection, linkPath } = channel;
  const offers = [];
  const lastTitlesScraped = await getLastTitles(lastTitlesDoc);

  const browser = await puppeteer.launch();
  const context = browser.defaultBrowserContext();
  context.overridePermissions(process.env.TARGET_URL, ['clipboard-read']);

  const page = await browser.newPage();
  await page.goto(process.env.TARGET_URL);

  const cards = await page.$$('.card-col');

  const cardsPromises = cards.map(async (card, index) => {
    return new Promise(async (res, rej) => {
      // try {
      const title = await card.$eval('.offer-title', (el) => el.textContent);
      if (
        targetWords.some((word) =>
          title.toLocaleUpperCase().includes(word.toLocaleUpperCase())
        )
      ) {
        if (
          lastTitlesScraped?.some((titleScrapped) => titleScrapped === title)
        ) {
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

        const imageLink = await card.$eval('.card-image img', (el) =>
          el.getAttribute('src')
        );

        const internalLink = await card.$eval('.offer-go-to-store', (el) =>
          el.getAttribute('href')
        );

        const date = dayjs().format('HH:mm - DD/MM/YYYY');

        if (internalLink === 'javascript:undefined') {
          console.log('🎟 Oferta com cupom!');
          const linkButton = await card.$('.offer-go-to-store');
          await page.waitForTimeout(1000);
          await linkButton.click();
          await page.waitForTimeout(1000);
          const button = await page.$('#cupon-to-store');
          await button.click();
          await page.waitForTimeout(1000);

          const coupon = await page.evaluate(
            async () => await navigator.clipboard.readText()
          );

          await page.waitForTimeout(2000);
          const pages = await browser.pages();
          const lastIndex = pages.length - 1;
          const dirtyLink = pages[lastIndex].url();
          const cleanLink = cleanLinkGenerator(dirtyLink);
          const id = nanoid(10);

          const offer = {
            id,
            title: changeTitle(title),
            previousPrice,
            offerPrice,
            paymentFormat,
            imageLink,
            offerLink: cleanLink,
            link: `${process.env.PROMO_LINK_BASE}/${linkPath}/${id}`,
            coupon,
            date
          };

          await saveFirebase(offer, firebaseCollection);
          offers.push(offer);
          res();
          return;
        }

        const offerPage = await browser.newPage();
        offerPage.goto(`${process.env.URL_BASE}${internalLink}`);
        await offerPage.waitForNavigation({ waitUntil: 'load' });
        const dirtyLink = await offerPage.url();
        const cleanLink = cleanLinkGenerator(dirtyLink);
        const id = nanoid(10);

        const offer = {
          id,
          title: changeTitle(title),
          previousPrice,
          offerPrice,
          paymentFormat,
          imageLink,
          offerLink: cleanLink,
          link: `${process.env.PROMO_LINK_BASE}/${linkPath}/${id}`,
          date
        };

        await saveFirebase(offer, firebaseCollection);
        offers.push(offer);
      }

      res();
      // } catch (err) {
      //   console.log(err);
      //   rej();
      // }
    });
  });

  await Promise.all(cardsPromises);

  if (titlesScrapped.length > 0) {
    await saveLastTitlesFirebase(titlesScrapped, lastTitlesDoc);
  }

  await sendTelegramLogs(offers);
  console.log(offers);
  await browser.close();
  return offers;
}

module.exports = getOffers;
