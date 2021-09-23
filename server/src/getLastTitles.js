const admin = require('./services/firebase');

async function getLastTitles() {
  const db = admin.firestore();
  const snapshot = await db.collection('lastTitles').doc('lastTitles').get();

  if (!snapshot.exists) return [];

  const { titles } = snapshot.data();

  return titles;
}

module.exports = getLastTitles;
