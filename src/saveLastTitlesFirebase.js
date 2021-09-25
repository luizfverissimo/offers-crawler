const admin = require('./services/firebase');

async function saveLastTitlesFirebase(titles, lastTitlesDoc) {
  const db = admin.firestore();
  const res = await db
    .collection('lastTitles')
    .doc(lastTitlesDoc)
    .set({ titles });

  console.log('🔥 Titles saved in Firebase');
  return;
}

module.exports = saveLastTitlesFirebase;
