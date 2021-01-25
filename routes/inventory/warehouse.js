// Routes relating to warehouse here
const express = require('express');

const warehouseRouter = express();
const pool = require('../../postgres/config');

warehouseRouter.use(express.json());

// Create a warehouse
warehouseRouter.post('/', async (req, res) => {
  try {
    const { warehouseLabel, division } = req.body;
    console.log(warehouseLabel, division);
    if (division === -1 || division === '-1') res.status(400).send("Can't add warehouse with no division");
    else if (warehouseLabel === '') res.status(400).send("Can't add warehouse with no label");
    else {
      const newWarehouse = await pool.query(`INSERT INTO warehouse (div_num, warehouse_name) VALUES 
                                            ($1,
                                            $2) RETURNING *`,
      [division, warehouseLabel]);
      res.send(newWarehouse.rows);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all warehouses part of a division
warehouseRouter.get('/', async (req, res) => {
  const division = req.query.division === '' ? -1 : req.query.division;
  try {
    const items = await pool.query('SELECT * FROM warehouse WHERE ($1 = -1 OR div_num = $1)', [division]);
    res.send(items.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get a warehouse by id
warehouseRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    Number.isInteger(id); // Make sure id is a number
    const warehouse = await pool.query('SELECT * FROM warehouse WHERE id = $1', [id]);
    res.send(warehouse.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a warehouse by id
warehouseRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    Number.isInteger(id); // Make sure id is a number
    await pool.query('DELETE FROM warehouse WHERE id = $1', [id]);
    res.send(`Warehouse with id ${id} was deleted.`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = warehouseRouter;
