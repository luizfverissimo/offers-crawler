const axios = require('axios');

const api = axios.create({
  baseURL: process.env.TELEGRAM_BASE
});

module.exports = api