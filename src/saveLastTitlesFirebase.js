const admin = require('./services/firebase');

async function saveLastTitlesFirebase(titles) {
  const db = admin.firestore();
  const res = await db.collection('lastTitles').doc('lastTitles').set({ titles });

  console.log('🔥 Titles saved in Firebase');
  return;
}

module.exports = saveLastTitlesFirebase;
