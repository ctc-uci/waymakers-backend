const express = require('express');

const warehouseRouter = express();
const pool = require('../../postgres/config');

warehouseRouter.use(express.json());

// Get all warehouses
warehouseRouter.get('/', async (req, res) => {
  try {
    const allWarehouses = await pool.query('SELECT * FROM warehouses');
    res.send(allWarehouses.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a warehouse
warehouseRouter.get('/:warehouselabel', async (req, res) => {
  const { warehouselabel } = req.params;
  try {
    const warehouse = await pool.query(`SELECT * FROM warehouses WHERE warehouselabel = '${warehouselabel}'`);
    res.send(warehouse.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create a warehouse
warehouseRouter.post('/', async (req, res) => {
  try {
    const { warehouselabel } = req.body;
    const newWarehouse = await pool.query(`INSERT INTO warehouses (warehouselabel) VALUES ('${warehouselabel}') RETURNING *`);
    res.send(newWarehouse.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a warehouse
warehouseRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      warehouselabel,
    } = req.body;
    if (warehouselabel) await pool.query(`UPDATE warehouses SET warehouselabel = '${warehouselabel}' WHERE id = ${id}`);
    res.send(`Warehouse with id ${id} was updated!`);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a warehouse
warehouseRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM warehouses WHERE id = ${id}`);
    res.send(`Warehouse with id ${id} was deleted.`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = warehouseRouter;