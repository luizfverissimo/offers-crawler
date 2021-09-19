const admin = require('./services/firebase');

async function getLastTitles() {
  return new Promise ((res, rej) => {
    const db = admin.database();
    const titlesRef = db.ref('lastTitles');
    titlesRef.on(
      'value',
      async (snapshot) => {
        console.log('🔥 Last titles retrieved.');

        const data = await snapshot.val();

        if(data !== null) {
          res(data) 
        }
        res([])
      },
      (err) => {
        console.log(err);
        res()
      }
    );
  })
}

module.exports = getLastTitles;
