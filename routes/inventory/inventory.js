// Routes relating to inventory here
const express = require('express');

const inventoryRouter = express();
const pool = require('../../postgres/config');

inventoryRouter.use(express.json());

// Get all item
inventoryRouter.get('/', async (req, res) => {
  try {
    const allItems = await pool.query('SELECT * FROM items');
    res.send(allItems.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get an item by category
inventoryRouter.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const item = await pool.query(`SELECT * FROM items WHERE category = '${category}'`);
    res.send(item.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// SEARCH for an item with SUBSTRING
inventoryRouter.get('/search/:substring', async (req, res) => {
  try {
    const { substring } = req.params;
    const item = await pool.query(`SELECT * FROM items WHERE strpos(name, '${substring}') > 0`);
    res.send(item.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// SEARCH for an item with SUBSTRING and CATEGORY
inventoryRouter.get('/search/:substring/:category', async (req, res) => {
  try {
    const { category, substring } = req.params;
    const item = await pool.query(`SELECT * FROM items WHERE strpos(name, '${substring}') > 0 AND category = '${category}'`);
    res.send(item.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create an item
inventoryRouter.post('/', async (req, res) => {
  try {
    const {
      name, quantity, needed, category,
    } = req.body;
    const newItem = await pool.query(`INSERT INTO items (name, quantity, needed, category) VALUES ('${name}', '${quantity}', '${needed}' , '${category}') RETURNING *`);
    res.send(newItem.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Update an item
inventoryRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, quantity, needed, category,
    } = req.body;
    if (name) await pool.query(`UPDATE items SET name = '${name}' WHERE id = ${id}`);
    if (quantity) await pool.query(`UPDATE items SET quantity = '${quantity}' WHERE id = ${id}`);
    if (needed) await pool.query(`UPDATE items SET needed = '${needed}' WHERE id = ${id}`);
    if (category) await pool.query(`UPDATE items SET category = '${category}' WHERE id = ${id}`);
    res.send(`Item with id ${id} was updated!`);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete an item
inventoryRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM items WHERE id = ${id}`);
    res.send(`Item with id ${id} was deleted.`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = inventoryRouter;
