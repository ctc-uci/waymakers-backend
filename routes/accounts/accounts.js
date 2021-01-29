// Routes relating to accounts here
const express = require('express');

const accountRouter = express();
const pool = require('../../postgres/config');

accountRouter.use(express.json());

// Get all accounts
accountRouter.get('/', async (req, res) => {
  try {
    const allAccounts = await pool.query('SELECT * FROM users');
    res.send(allAccounts.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get an account
accountRouter.get('/:id', async (req, res) => {
  console.log('request made to /:id route');

  const { id } = req.params;
  try {
    const account = await pool.query(`SELECT * FROM users WHERE userid = '${id}'`);
    const permission = await pool.query(`SELECT * FROM permissions WHERE userid = '${id}'`);
    const availability = await pool.query(`SELECT * FROM availability WHERE userid = '${id}'`);
    res.send({
      account: account.rows[0],
      permissions: permission.rows[0],
      availability: availability.rows,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create an account
accountRouter.post('/', async (req, res) => {
  console.log('got here');
  try {
    const {
      userID, firstName, lastName, birthDate, locationStreet, locationCity,
      locationState, locationZip, tier, permission,
    } = req.body;
    const newAccount = await pool.query(`
      INSERT INTO users (userid, firstname, lastname, birthdate, locationstreet, locationcity,
      locationstate, locationzip, tier)
      VALUES ('${userID}', '${firstName}', '${lastName}', '${birthDate}', '${locationStreet}',
      '${locationCity}', '${locationState}', '${locationZip}', '${tier}') RETURNING *`);
    const newPermission = await pool.query(`
      INSERT INTO permissions (userid, permissions) 
      VALUES ('${userID}', '${permission}') RETURNING *`);
    res.send({
      newAccount: newAccount.rows[0],
      newPermission: newPermission.rows[0],
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update an account
accountRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName, lastName, birthDate, locationStreet, locationCity,
      locationState, locationZip, tier, permission,
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
                      ${tier ? `tier = '${tier}'` : ''}
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
