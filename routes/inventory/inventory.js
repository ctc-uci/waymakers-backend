// Routes relating to inventory here
const express = require('express');

const inventoryRouter = express();
const pool = require('../../postgres/config');

inventoryRouter.use(express.json());

// Get items; defaults to all items
// Optional query params: division id, category id, search term to filter
inventoryRouter.get('/', async (req, res) => {
  const division = req.query.division == null ? -1 : req.query.division;
  const category = req.query.category == null ? -1 : req.query.category;
  const { search } = req.query;
  try {
    const items = await pool.query(`SELECT * FROM items WHERE (${division}=-1 OR div_num = ${division}) AND 
    (${category}=-1 OR category_id =${category}) AND 
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
      name, quantity, needed,
    } = req.body;
    // We need to set category and division to null if there's no input so SQL doesn't cry about it
    const category = req.body.category ? req.body.category : null; // Category ID
    const division = req.body.division ? req.body.division : null; // Division ID
    const newItem = await pool.query(`INSERT INTO items (name, quantity, needed, div_num, category_id) VALUES ('${name}', '${quantity}', '${needed}' , ${division}, ${category})`);
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
    if (quantity) await pool.query(`UPDATE items SET quantity = ${quantity} WHERE id = ${id}`);
    if (needed) await pool.query(`UPDATE items SET needed = ${needed} WHERE id = ${id}`);
    if (category !== null) await pool.query(`UPDATE items SET category_id = ${category} WHERE id = ${id}`);
    else await pool.query(`UPDATE items SET category_id = NULL WHERE id = ${id}`);
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
    res.send(`Item with id ${id} was deleted!`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = inventoryRouter;
