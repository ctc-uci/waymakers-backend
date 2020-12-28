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

// Get an item by WAREHOUSE
inventoryRouter.get('/get/', async (req, res) => {
  const {
    division, category, search,
  } = req.query;
  try {
    const items = await pool.query(`SELECT * FROM items WHERE (div_num = (SELECT div_num FROM divisions WHERE div_name='${division}') OR '${division}' = '') AND 
    (category_id = (SELECT id FROM item_categories WHERE label='${category}') OR '${category}' = '') AND 
    (LOWER(name) LIKE LOWER('%${search}%') OR '${search}' = '')`);
    res.send(items.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create an item
inventoryRouter.post('/', async (req, res) => {
  try {
    const {
      name, quantity, needed, division, category,
    } = req.body;
    console.log(name, quantity, needed, division, category);
    const newItem = await pool.query(`INSERT INTO items (name, quantity, needed, div_num, category_id) VALUES ('${name}', '${quantity}', '${needed}' , (SELECT div_num from divisions WHERE div_name='${division}'), (SELECT id from item_categories WHERE label='${category}'))`);
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
    if (category) await pool.query(`UPDATE items SET category_id = (SELECT id from item_categories WHERE label='${category}') WHERE id = ${id}`);
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
