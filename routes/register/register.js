// Routes relating to registering accounts here
const express = require('express');
// const axios = require('axios');

const pool = require('../../postgres/config');
const { sgMail } = require('../../sendgrid/sendgrid');

const registerRouter = express();
registerRouter.use(express.json());

registerRouter.post('/create', async (req, res) => {
  console.log('POST /register/create in', req.body);

  try {
    const {
      userID, firstName, lastName, email, phoneNumber, address1,
      address2, city, state, zipcode, birthDate, gender, division,
      verified,
    } = req.body;

    const newAccount = await pool.query(`
    INSERT INTO users (userid, firstname, lastname, birthDate, email, phone, locationstreet, location_street_2,
      locationcity, locationstate, locationzip, gender, division, verified)
    VALUES ('${userID}', '${firstName}', '${lastName}', '${birthDate}', '${email}',
    '${phoneNumber}', '${address1}', '${address2}', '${city}', '${state}',
    '${zipcode}', '${gender}', '${division}', '${verified}')
    RETURNING *
  `);

    const newPermission = await pool.query(`
      INSERT INTO permissions (userid, permissions)
      VALUES ('${userID}', 'Volunteer')
      RETURNING *
  `);

    res.status(200).send({
      newAccount: newAccount.rows[0],
      newPermission: newPermission.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

registerRouter.post('/sendVerification', async (req, res) => {
  console.log('POST /register/sendVerification in', JSON.stringify(req.body));
  const { body: { userID, firstName, email } } = req;

  const emailLink = process.env.NODE_ENV === 'production'
    ? `${process.env.SELF_DOMAIN}`
    : `${process.env.SELF_DOMAIN}:${process.env.SELF_PORT}`;

  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: 'Welcome to Waymakers! Please Verify Your Email Address',
      text: 'Filler Text',
      html:
      `
        <html lang="en">
          <head>
            <meta charset="utf-8 />
          </head>
          <body style="width: 600px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="color: #003E53; font-family: Helvetica;">
              <tr align="center">
                <td></td>
                <td width="600">
                  <img src="https://wmk-dev-1.s3-us-west-1.amazonaws.com/wmklogo.png" title="Logo" alt="Waymakers" width="400" height="134.54" style="display: block;" />
                </td>
                <td></td>
              </tr>
              <tr align="center">
                <td></td>
                <td width="600">
                  <h1 style="font-size: 50px;">Welcome to Waymakers!</h1>
                </td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td width="600">
                  <p style="color: #003E53; line-height: 30px; font-size: 20px;">Thank you for signing up with us, ${firstName}</p>
                  <p style="color: #003E53; line-height: 30px; font-size: 20px;">We're excited to see that you've signed up to volunteer with us!</p>
                  <p style="color: #003E53; line-height: 30px; font-size: 20px;">To get you started, please click on the button below to confirm your email address.</p>
                  <br></br>
                </td>
                <td></td>
              </tr>
              <tr align="center">
                <td></td>
                <td width="600">
                  <a
                    href="${emailLink}/register/verify/${userID}"
                    style="
                      display: block;
                      border-radius: 10px;
                      -webkit-appearance: none;
                      text-decoration: none;
                      box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.46);
            
                      cursor: pointer;
            
                      text-align: center;
                      line-height: 37px;
                      color: white;
                      background: #5D9A64;
            
                      height: 37px;
                      width: 170px;"
                  >
                    <span style="font-size: 20px; font-weight: 600;">Verify Email</span>
                  </a>
                  <br></br>
                </td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td width="600">
                  <p style="line-height: 30px; font-size: 20px;">Happy Volunteering,</p>
                  <p style="line-height: 30px; font-size: 20px;">Waymakers Support Team</p>
                </td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td width="600">
                  <p style="color: #757575; font-size: 12px;">
                    PS. If this email was sent by mistake, sorry! Simply ignore the email and don't click the button.
                  </p>
                </td>
                <td></td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };

    await sgMail.send(msg);
    console.log('Email sent');

    res.status(200).send('Email sent');
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

registerRouter.get('/verify/:id', async (req, res) => {
  console.log('GET /register/verify/:id in', JSON.stringify(req.params));

  try {
    const { params: { id } } = req;

    const pgRes = await pool.query(`
      SELECT email FROM users
      WHERE userid = $1
    `, [id]);

    const userEmail = pgRes.rows[0].email;

    if (!userEmail) {
      return res.status(200).send('User not found');
    }
    console.log(userEmail);

    // DEPRECATED
    // const { data } = await axios.get('https://apilayer.net/api/check', {
    //   params: {
    //     access_key: process.env.MAILBOXLAYER_API_KEY,
    //     email: userEmail,
    //     smtp: '1',
    //   },
    // });
    // console.log(data);

    // if (!data.mx_found) {
    //   return res.status(400).send('Email is not a valid email');
    // }

    // If it didn't exit at this point it means the user is good to be verified
    await pool.query(`
      UPDATE users
        SET verified = TRUE
      WHERE userid = $1
    `, [id]);

    return process.env.NODE_ENV === 'production'
      ? res.redirect(`${process.env.WMK_REACT_APP_HOST}/login`)
      : res.redirect(`${process.env.WMK_REACT_APP_HOST}:${process.env.WMK_REACT_APP_PORT}/login`);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
});

registerRouter.get('/isVerified', async (req, res) => {
  console.log('GET /isVerified/:id in', JSON.stringify(req.query));

  try {
    const { query: { email } } = req;

    const pgRes = await pool.query(`
      SELECT verified FROM users
      WHERE email = $1
    `, [email]);
    if (pgRes.rows.length < 1) {
      return res.status(200).send('Email not found');
    }

    return res.status(200).send(pgRes.rows[0].verified);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
});

registerRouter.get('/divisions', async (req, res) => {
  try {
    const allDivisions = await pool.query('SELECT * FROM division');
    res.send(allDivisions.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

registerRouter.get('/:id', async (req, res) => {
  console.log('GET /register/:id in', req.params);
  const { params: { id } } = req;

  try {
    const result = await pool.query(`
      SELECT EXISTS(SELECT 1
        FROM   users
        WHERE  userid = $1) 
    `, [id]);

    res.status(200).send(result.rows[0].exists);
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

module.exports = registerRouter;
