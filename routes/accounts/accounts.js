// Routes relating to accounts here
const aws = require('aws-sdk');
const express = require('express');

const accountRouter = express();
const pool = require('../../postgres/config');

accountRouter.use(express.json());

const region = process.env.AWS_S3_BUCKET_REGION;
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

// Get all accounts
accountRouter.get('/', async (req, res) => {
  try {
    const allAccounts = await pool.query('SELECT * FROM users');
    res.send(allAccounts.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get an s3 url
accountRouter.get('/s3Url', async (req, res) => {
  const { cookies: { userId } } = req;

  try {
    const params = ({
      Bucket: bucketName,
      Key: userId + Math.floor(Math.random() * 10),
      Expires: 60,
    });

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    console.log(uploadURL);

    res.status(200).send(uploadURL);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

// Get an account
accountRouter.get('/:id', async (req, res) => {
  console.log('request made to /:id route');

  const { id } = req.params;
  try {
    const account = await pool.query(`SELECT * FROM users WHERE userid = '${id}'`);
    const permission = await pool.query(`SELECT * FROM permissions WHERE userid = '${id}'`);
    res.send({
      account: account.rows[0],
      permissions: permission.rows[0],
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create an account in ../register/register;

// Update an account
accountRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName, lastName, birthDate, locationStreet, locationCity,
      locationState, locationZip, tier, permission, profilePicture,
    } = req.body;
    const userQuery = `
                UPDATE users
                  SET ${firstName ? `firstname = '${firstName}',` : ''}
                      ${lastName ? `lastname = '${lastName}',` : ''}
                      ${birthDate ? `birthdate = '${birthDate}',` : ''}
                      ${locationStreet ? `locationstreet = '${locationStreet}',` : ''}
                      ${locationCity ? `locationcity = '${locationCity}',` : ''}
                      ${locationState ? `locationstate = '${locationState}',` : ''}
                      ${locationZip ? `locationzip = '${locationZip}',` : ''}
                      ${tier ? `tier = '${tier}',` : ''}
                      ${profilePicture ? `profile_picture = '${profilePicture}'` : ''}
                  WHERE userid = '${id}'
                `;
    await pool.query(userQuery);

    if (permission) await pool.query(`UPDATE permissions SET permissions = '${permission}' WHERE userid = '${id}'`);

    res.send(`Account with id ${id} was updated!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete an account
accountRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM users WHERE userid = '${id}'`);
    res.send(`Account with id ${id} was deleted.`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = accountRouter;
