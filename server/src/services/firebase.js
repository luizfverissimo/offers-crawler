const admin = require('firebase-admin')

const serviceAccount = require('/Users/luizfverissimo/Documents/spider-promo-firebase-adminsdk-44kwx-91814c526c.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

module.exports = admin

//firebase WEB
// const firebase = require('firebase/app');

// // require('firebase/auth');

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID
// };

// firebase.initializeApp(firebaseConfig);

// // const auth = firebase.auth();

// module.exports = firebase;
