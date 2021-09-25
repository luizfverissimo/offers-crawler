const admin = require('./services/firebase');

async function getLastTitles(lastTitlesDoc) {
  const db = admin.firestore();
  const snapshot = await db.collection('lastTitles').doc(lastTitlesDoc).get();

  if (!snapshot.exists) return [];

  const { titles } = snapshot.data();

  return titles;
}

module.exports = getLastTitles;
