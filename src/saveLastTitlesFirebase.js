const admin = require('./services/firebase');

async function saveLastTitlesFirebase(titlesScrapped, lastTitlesDoc) {
  const db = admin.firestore();
  const snapshot = await db.collection('lastTitles').doc(lastTitlesDoc).get();

  const { titles } = await snapshot.data();
  const newTitle = [...titles, ...titlesScrapped];

  const res = await db
    .collection('lastTitles')
    .doc(lastTitlesDoc)
    .set({ titles: newTitle, ti });

  console.log('🔥 Titles saved in Firebase');
  return;
}

module.exports = saveLastTitlesFirebase;
