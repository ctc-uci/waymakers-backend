// Routes relating to accounts here
const express = require('express');

const accountRouter = express();
const pool = require('./accountDB');

accountRouter.use(express.json());

// Get all accounts
accountRouter.get('/', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM accounts');
    res.send(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get an account
accountRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const account = await pool.query(`SELECT * FROM accounts WHERE account_id = ${id}`);
    res.send(account.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create an accountnp
accountRouter.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newAccount = await pool.query(`INSERT INTO accounts (username, password) VALUES ('${username}', '${password}') RETURNING *`);
    res.send(newAccount.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Update an account
accountRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    if (username) await pool.query(`UPDATE accounts SET username = '${username}' WHERE account_id = ${id}`);
    if (password) await pool.query(`UPDATE accounts SET password = '${password}' WHERE account_id = ${id}`);
    res.send(`Account with id ${id} was updated!`);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete an account
accountRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM accounts WHERE account_id = ${id}`);
    res.send(`Account with id ${id} was deleted.`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = accountRouter;
