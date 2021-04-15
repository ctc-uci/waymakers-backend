// Routes relating to accounts here
const express = require('express');

const registerRouter = express();
const pool = require('../../postgres/config');

registerRouter.use(express.json());

registerRouter.post('/create', async (req, res) => {
  console.log('POST /register/create in');
  console.log(req.body);

  try {
    const {
      userID, firstName, lastName, email, phoneNumber, address1,
      address2, city, state, zipcode, birthDate, gender, division,
    } = req.body;

    const newAccount = await pool.query(`
    INSERT INTO users (userid, firstname, lastname, birthDate, email, phone, locationstreet, location_street_2,
      locationcity, locationstate, locationzip, gender, division)
    VALUES ('${userID}', '${firstName}', '${lastName}', '${birthDate}', '${email}',
    '${phoneNumber}', '${address1}', '${address2}', '${city}', '${state}',
    '${zipcode}', '${gender}', '${division}')
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

module.exports = registerRouter;
