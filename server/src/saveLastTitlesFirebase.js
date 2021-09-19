const admin = require('./services/firebase')

async function saveLastTitlesFirebase(titles) {
  const db = admin.database()
  const titlesRef = db.ref('lastTitles')
  titlesRef.set(titles)

  console.log('🔥 Titles saved in Firebase')
  return
}

module.exports = saveLastTitlesFirebase