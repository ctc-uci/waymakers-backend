// Routes relating to accounts here
const express = require('express');
const admin = require('../../firebase/firebase');

const authRouter = express();

const verifyToken = async (req, res, next) => {
  console.log('@verifyToken in');
  const { cookies: { accessToken } } = req;

  if (!accessToken) {
    return res.status(400).send('No access token provided');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(accessToken);
    if (!decodedToken) {
      return res.status(400).send('Empty token from firebase');
    }
    console.log(decodedToken);

    return next();
  } catch (err) {
    console.log(err);
    res.status(400).send('User not logged in');
  }

  return res.status(400).send('Unable to authenticate user');
};

authRouter.get('/verifyToken/:token', async (req, res) => {
  console.log('@auth/verifyToken in');

  const { token } = req.params;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken);

    res.status(200).send(decodedToken.uid);
  } catch (err) {
    // Handle error
    res.status(400).send(err);
  }
});

module.exports = { authRouter, verifyToken };
