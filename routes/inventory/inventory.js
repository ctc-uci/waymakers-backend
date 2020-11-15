// Routes relating to inventory here
// Routes relating to inventory here
const express = require('express');

const inventoryRouter = express();
const pool = require('./inventoryDB');

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

// Get an item
inventoryRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await pool.query(`SELECT * FROM items WHERE id = ${id}`);
    res.send(item.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create an item
inventoryRouter.post('/', async (req, res) => {
  try {
    const {
      name, inStock, numberNeeded, category,
    } = req.body;
    const newItem = await pool.query(`INSERT INTO items (name, inStock, numberNeeded, category) VALUES ('${name}', '${inStock}', '${numberNeeded}' , '${category}') RETURNING *`);
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
      name, inStock, numberNeeded, category,
    } = req.body;
    if (name) await pool.query(`UPDATE items SET name = '${name}' WHERE id = ${id}`);
    if (inStock) await pool.query(`UPDATE items SET inStock = '${inStock}' WHERE id = ${id}`);
    if (numberNeeded) await pool.query(`UPDATE items SET numberNeeded = '${numberNeeded}' WHERE id = ${id}`);
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
