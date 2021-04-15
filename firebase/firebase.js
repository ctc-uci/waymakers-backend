const admin = require('firebase-admin');
const serviceAccount = require('../waymakers-6465d-firebase-adminsdk-2wasv-0fba3e25c9.json');

require('dotenv').config();

let credentials;

if (process.env.NODE_ENV !== 'PRODUCTION') {
  credentials = serviceAccount;
} else {
  credentials = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  };
}

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: 'https://waymakers.firebaseio.com',
});
