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
    const allAccounts = await pool.query(`
      SELECT users.userid,
            users.firstname,
            users.lastname,
            users.birthdate,
            users.locationstreet,
            users.locationcity,
            users.locationzip,
            users.locationstate,
            users.tier,
            users.division,
            users.phone,
            users.email,
            users.location_street_2,
            users.gender,
            users.profile_picture,
            users.verified,
            permissions.permissions,
            division.div_name
      FROM users
          INNER JOIN permissions
                  ON ( users.userid = permissions.userid )
          LEFT OUTER JOIN division
                      ON ( users.division = division.id ) 
      WHERE
        users.verified
    `);
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
    const account = await pool.query(`SELECT * FROM users
                                      WHERE userid = '${id}' AND
                                      users.verified`);
    // console.log(account);
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

// TODO: SQL injection
// Update an account
accountRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName, lastName, email, phone, birthDate, locationStreet, locationCity,
      locationState, locationZip, tier, gender, profilePicture,
    } = req.body;
    const userQuery = `
                UPDATE users
                  SET ${firstName ? `firstname = '${firstName}',` : ''}
                      ${lastName ? `lastname = '${lastName}',` : ''}
                      ${birthDate ? `birthdate = '${birthDate}',` : ''}
                      ${email ? `email = '${email}',` : ''}
                      ${phone ? `phone = '${phone}',` : ''}
                      ${locationStreet ? `locationstreet = '${locationStreet}',` : ''}
                      ${locationCity ? `locationcity = '${locationCity}',` : ''}
                      ${locationState ? `locationstate = '${locationState}',` : ''}
                      ${locationZip ? `locationzip = '${locationZip}',` : ''}
                      ${gender ? `gender = '${gender}',` : ''}
                      ${tier ? `tier = '${tier}',` : ''}
                      ${profilePicture ? `profile_picture = '${profilePicture}'` : ''}
                  WHERE userid = '${id}'
                `;
    await pool.query(userQuery);

    // if (permission) await pool.query(`UPDATE permissions
    // SET permissions = '${permission}' WHERE userid = '${id}'`);

    res.send(`Account with id ${id} was updated!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update an account
accountRouter.put('/adminUpdate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      division, position,
    } = req.body;

    if (!division || !position) {
      res.status(400).send('Missing body');
      return;
    }

    const isValidUser = await pool.query(`
    SELECT 1
      from users
      WHERE userid = $1`,
    [id]);

    if (isValidUser.rowCount === 0) {
      res.status(400).send('Invalid user');
      return;
    }

    await pool.query(`
      UPDATE users
      SET division = $1
      WHERE userid = $2`,
    [division, id]);

    await pool.query(`
      UPDATE permissions
      SET permissions = $1
      WHERE userid = $2`,
    [position, id]);

    res.send('Account was updated!');
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
