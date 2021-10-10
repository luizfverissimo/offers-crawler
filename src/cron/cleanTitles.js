const cron = require('node-cron');
const admin = require('../services/firebase');
const sendTelegramLogs = require('../sendTelegramLogs');

const channelGroups = require('../../channelGroups.json');

const { macOfertas, gamerOffers, smartPhoneOffers } = channelGroups;

//0 4 * * * todo dia as 4h - executa essa tarefa

const cleaner = cron.schedule('0 12 * * *', async () => {
  console.log('🧹 Cron Running cleanTitles...');
  await sendTelegramLogs('🧹 Cron Running cleanTitles...');

  await cleanTitles(macOfertas.lastTitlesDoc)
  await cleanTitles(gamerOffers.lastTitlesDoc)
  await cleanTitles(smartPhoneOffers.lastTitlesDoc)
  return
});


async function cleanTitles(lastTitlesDoc) {
  const db = admin.firestore();
  const snapshot = await db.collection('lastTitles').doc(lastTitlesDoc).get();

  const { titles } = snapshot.data();

  const cleanedTitles = titles.slice(Math.floor((titles.length - 1)/2),  titles.length)

  await db.collection('lastTitles').doc(lastTitlesDoc).set({titles: cleanedTitles})
  return
}

module.exports = cleaner;