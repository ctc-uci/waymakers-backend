const express = require('express');

const divisionRouter = express();
const pool = require('../../postgres/config');

divisionRouter.use(express.json());

// Get all divisions
divisionRouter.get('/', async (req, res) => {
  try {
    const allDivisions = await pool.query('SELECT * FROM division');
    res.send(allDivisions.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get a division by id
divisionRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    Number.isInteger(id); // Make sure id is a number
    const division = await pool.query('SELECT * FROM division WHERE id = $1', [id]);
    res.send(division.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create a division
divisionRouter.post('/', async (req, res) => {
  try {
    const { divisionLabel } = req.body;
    if (divisionLabel) {
      const newDivision = await pool.query('INSERT INTO division (div_name) VALUES ($1) RETURNING *', [divisionLabel]);
      res.send(newDivision.rows);
    } else res.status(400).send("Can't add empty division");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a division
divisionRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    Number.isInteger(id); // Make sure id is a number
    await pool.query('DELETE FROM division WHERE id = $1', [id]);
    res.send(`Division with id ${id} was deleted.`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = divisionRouter;
