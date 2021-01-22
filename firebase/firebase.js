const admin = require('firebase-admin');
const serviceAccount = require('../waymakers-6465d-firebase-adminsdk-2wasv-0fba3e25c9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://waymakers.firebaseio.com',
});

module.exports = admin;
