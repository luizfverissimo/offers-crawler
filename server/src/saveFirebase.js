const admin = require('./services/firebase')

async function saveFirebase(offer) {
  const db = admin.database()
  const offersRef = db.ref('offers/' + offer.id)
  offersRef.set(offer)

  console.log('🔥 Offers saved in Firebase')
  return
}


module.exports = saveFirebase

// const {getDatabase, ref, set} = require('firebase/database')

// const db = getDatabase()

// async function saveFirebase(offer) {
//   const offersRef = ref(db, 'offers/' + offer.id)
//   set(offersRef,  offer)

//   console.log('Saved in Firebase')
//   return 
// }

// module.exports = saveFirebase