const admin = require('./services/firebase')

async function saveFirebase(offer, collection) {
  const db = admin.firestore()
  const timestamp = admin.firestore.FieldValue.serverTimestamp()
  const res = await db.collection(collection).doc(offer.id).set({...offer, timestamp})

  console.log('🔥 Offers saved in Firebase')
  return
}


module.exports = saveFirebase
