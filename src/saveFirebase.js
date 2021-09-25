const admin = require('./services/firebase')

async function saveFirebase(offer, collection) {
  const db = admin.firestore()
  const res = await db.collection(collection).doc(offer.id).set(offer)

  console.log('🔥 Offers saved in Firebase')
  return
}


module.exports = saveFirebase
