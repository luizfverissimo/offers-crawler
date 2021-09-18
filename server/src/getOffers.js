const puppeteer = require('puppeteer');
const cleanLinkGenerator = require('./cleanLinkGenerator');


let titlesScrapped = [];

  async function getOffers(targetWords) {
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
          targetWords.some((word) =>
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
            await page.waitForTimeout(2000);
  
            const pages = await browser.pages();
  
            const lastIndex = pages.length - 1;
            const dirtyLink = pages[lastIndex].url();
            
            const cleanLink = cleanLinkGenerator(dirtyLink)
  
            const offer = {
              title,
              previousPrice,
              offerPrice,
              paymentFormat,
              link: cleanLink,
              cupon
            };
            offers.push(offer);
  
            res();
            return;
          }
  
  
          const offerPage = await browser.newPage();
          offerPage.goto(`${process.env.URL_BASE}${internalLink}`);
          await offerPage.waitForNavigation({ waitUntil: 'load' });
  
          const dirtyLink = await offerPage.url();
  
          const cleanLink = cleanLinkGenerator(dirtyLink);
  
          const offer = {
            title,
            previousPrice,
            offerPrice,
            paymentFormat,
            link: cleanLink
          };
          offers.push(offer);
        }
        res();
      });
    });
  
    await Promise.all(cardsPromises);
  
    console.log(offers);
  
    await browser.close();
    return offers;
  }

  module.exports = getOffers