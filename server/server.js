const express = require('express');
const puppeteer = require('puppeteer');

require('dotenv').config();

const app = express();

async function getText(selector, page) {
  const text = await page.$$eval(selector, elements => elements.map(item => item.textContent))
  return text
}

// async function getUrl(selector, page) {
//   await page.$$eval(selector, elements => elements.map(item => item.textContent))
// }


app.get('/', async (req, res) => {
  console.log('request received!');
  const offers = []
  
  // try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.TARGET_URL);

    const cards = await page.$$('.card-col')

    const cardsPromises = cards.map(async (card, index) => {
      return new Promise(async (res, rej) => {
        const title = await card.$eval('.offer-title', el => el.textContent)
        console.log(title)
        res()
      })
    })

    await Promise.all(cardsPromises)

    // const titles = await getText('.offer-title', page)
    // const offerPrices = await getText('.offer-card-price', page)
    // const previousPrices = await getText('.offer-previous-price', page)

    // titles.forEach((title, index) => {
    //   const offer = {
    //     title,
    //     offerPrice: offerPrices[index],
    //     previousPrice: previousPrices[index],
    //   }

    //   offers.push(offer)
    // })

    // console.log(offers)

    // offers.forEach(offer => {
    //   if(offer.title.includes('Match')) {

    //   }
    // })

    await browser.close();
    res.send('Procedimento completo');
  // } catch (err) {
  //   res.status(500).send(err);
  // }
});

app.listen(process.env.PORT, () => {
  console.log(`Server app listening at http://localhost:${process.env.PORT}`);
});
