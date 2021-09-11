const express = require('express');
const puppeteer = require('puppeteer');

require('dotenv').config()

const app = express();

app.get('/', async (req, res) => {
  console.log('request received!');

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.goto('https://www.ofertaesperta.com/#ofertas');
  
    console.log(await page.content());
    const image = await page.screenshot({path: 'print.png'});
  
    await browser.close();
  
    res.send(image);
  } catch(err) {
    res.status = 505
    res.send(err)
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server app listening at http://localhost:${process.env.PORT}`);
});
