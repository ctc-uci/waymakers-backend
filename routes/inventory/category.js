const express = require('express');

const categoryRouter = express();
const pool = require('../../postgres/config');

categoryRouter.use(express.json());

// Get all categories
categoryRouter.get('/', async (req, res) => {
  try {
    const allCategories = await pool.query('SELECT * FROM item_categories');
    res.send(allCategories.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a category
categoryRouter.get('/:label', async (req, res) => {
  const { label } = req.params;
  try {
    const category = await pool.query(`SELECT * FROM item_categories WHERE label = '${label}'`);
    res.send(category.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create a category
categoryRouter.post('/', async (req, res) => {
  try {
    const { label } = req.body;
    if (label) {
      const newCategory = await pool.query(`INSERT INTO item_categories (label) VALUES ('${label}') RETURNING *`);
      res.send(newCategory.rows);
    }
  } catch (err) {
    console.error(err.message);
  }
});

// Update a category
categoryRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      label,
    } = req.body;
    if (label) await pool.query(`UPDATE item_categories SET label = '${label}' WHERE id = ${id}`);
    res.send(`Category with id ${id} was updated!`);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a category
categoryRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM item_categories WHERE id = ${id}`);
    res.send(`Category with id ${id} was deleted!`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = categoryRouter;
