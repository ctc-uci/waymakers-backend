const express = require('express');

const categoryRouter = express();
const pool = require('../../postgres/config');

categoryRouter.use(express.json());

// Get all categories
categoryRouter.get('/', async (req, res) => {
  try {
    const allCategories = await pool.query('SELECT * FROM item_category');
    res.send(allCategories.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get a category by id
categoryRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    Number.isInteger(id); // Make sure id is a number
    const category = await pool.query('SELECT * FROM item_category WHERE id = $1', [id]);
    res.send(category.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create a category
categoryRouter.post('/', async (req, res) => {
  try {
    const { label } = req.body;
    if (label) {
      const newCategory = await pool.query('INSERT INTO item_category (label) VALUES ($1) RETURNING *', [label]);
      res.send(newCategory.rows);
    } else res.status(400).send("Can't add empty category");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update a category
categoryRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { label } = req.body;
    Number.isInteger(id); // Make sure id is a number
    if (label) {
      await pool.query('UPDATE item_category SET label = $1 WHERE id =$2', [label, id]);
      res.send(`Category with id ${id} was updated!`);
    } else res.status(400).send("Can't update category with empty label");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a category
categoryRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    Number.isInteger(id); // Make sure id is a number
    await pool.query('DELETE FROM item_category WHERE id = $1', [id]);
    res.send(`Category with id ${id} was deleted!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = categoryRouter;
