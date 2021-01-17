// Routes relating to warehouse here
const express = require('express');

const warehouseRouter = express();
const pool = require('../../postgres/config');

warehouseRouter.use(express.json());

// Create a warehouse
warehouseRouter.post('/', async (req, res) => {
  try {
    const { warehouseLabel } = req.body;
    const division = req.body.division ? req.body.division : null;
    console.log(warehouseLabel);
    if (warehouseLabel) {
      const newWarehouse = await pool.query(`INSERT INTO warehouses (div_num, warehouse_name) VALUES ('${division}, ${warehouseLabel})`);
      res.send(newWarehouse.rows);
    }
  } catch (err) {
    console.error(err.message);
  }
});

// Get a warehouse
warehouseRouter.get('/', async (req, res) => {
  const division = req.query.division == null ? -1 : req.query.division;
  try {
    const items = await pool.query(`SELECT * FROM warehouses WHERE (${division}=-1 OR div_num = ${division})`);
    res.send(items.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a warehouse by label
warehouseRouter.get('/:label', async (req, res) => {
  const { label } = req.params;
  try {
    const warehouse = await pool.query(`SELECT * FROM warehouses WHERE warehouse_name = '${label}'`);
    res.send(warehouse.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a division
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
