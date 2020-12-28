const express = require('express');

const divisionRouter = express();
const pool = require('../../postgres/config');

divisionRouter.use(express.json());

// Get all divisions
divisionRouter.get('/', async (req, res) => {
  try {
    const allDivisions = await pool.query('SELECT * FROM divisions');
    res.send(allDivisions.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a division by label
divisionRouter.get('/:label', async (req, res) => {
  const { label } = req.params;
  try {
    const division = await pool.query(`SELECT * FROM divisions WHERE div_name = '${label}'`);
    res.send(division.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create a division
divisionRouter.post('/', async (req, res) => {
  try {
    const { label } = req.body;
    const newDivision = await pool.query(`INSERT INTO divisions (div_name) VALUES ('${label}') RETURNING *`);
    res.send(newDivision.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a division
divisionRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM divisions WHERE id = ${id}`);
    res.send(`Division with id ${id} was deleted.`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = divisionRouter;
