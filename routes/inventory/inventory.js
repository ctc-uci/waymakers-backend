// Routes relating to inventory here
const express = require('express');

const inventoryRouter = express();
const pgp = require('pg-promise')({});
const pool = require('../../postgres/config');

const cn = `postgres://${process.env.AWS_USER}:${process.env.AWS_PASSWORD}@${process.env.AWS_HOST}:${process.env.AWS_PORT}/${process.env.AWS_DATABASE}`; // For pgp

const db = pgp(cn); // For inventory.put

inventoryRouter.use(express.json());

// Get items; defaults to all items
// Optional query params: division id, category id, warehouse id search term to filter
inventoryRouter.get('/', async (req, res) => {
  const division = req.query.division == null ? -1 : req.query.division;
  const category = req.query.category == null ? -1 : req.query.category;
  const warehouse = req.query.warehouse == null ? -1 : req.query.warehouse;
  const search = req.query.search == null ? '' : req.query.search;
  try {
  const items = await pool.query(`SELECT  
                                    item.id,
                                    name,
                                    quantity,
                                    needed,
                                    category_id,
                                    warehouse_name,
                                    div_name,
                                    label
                                  FROM item
                                    INNER JOIN warehouse
                                      ON item.warehouse_num = warehouse.id 
                                    INNER JOIN division
                                      ON warehouse.div_num = division.id
                                    LEFT JOIN item_category
                                      ON item.category_id = item_category.id
                                  WHERE
                                    ($1 = -1 OR division.id = $1)
                                  AND
                                    ($2 = -1 OR item.category_id = $2)
                                  AND
                                    ($3 = -1 OR item.warehouse_num = $3)
                                  AND 
                                    ($4 = '' OR (LOWER(item.name) LIKE LOWER('%' || $4 || '%')))`,
    [division, category, warehouse, search]);
    res.send(items.rows);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

inventoryRouter.get('/download/', async (req, res) => {
  const division = req.query.division == null ? -1 : req.query.division;
  try {
    const items = await pool.query(`SELECT  
                                      item.id,
                                      name,
                                      quantity,
                                      needed,
                                      label AS category,
                                      warehouse_name,
                                      div_name
                                    FROM item
                                      INNER JOIN warehouse
                                        ON item.warehouse_num = warehouse.id 
                                      INNER JOIN division
                                        ON warehouse.div_num = division.id
                                      LEFT JOIN item_category
                                        ON item.category_id = item_category.id
                                    WHERE
                                      ($1 = -1 OR division.id = $1)`,
      [division]);
      res.send(items.rows);
    } catch (err) {
      console.log(err.message);
      res.status(400).send(err.message);
    }
});

// Gets the X most recently edited items (3 by default)
inventoryRouter.get('/top/', async (req, res) => {
  const { warehouse } = req.query;

  try {
    const numItems = req.query.numItems == null ? 3 : req.query.numItems;
    if (parseInt(numItems, 10) > 0) {
      if (warehouse) {
        const items = await pool.query('SELECT * FROM item WHERE warehouse_num = $1 ORDER BY last_edited DESC LIMIT $2', [warehouse, numItems]);
        res.send(items.rows);
      } else {
        const items = await pool.query('SELECT * FROM item ORDER BY last_edited DESC LIMIT $1', [numItems]);
        res.send(items.rows);
      }
    } else res.status(400).send('Invalid number of items requested');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create an item
inventoryRouter.post('/', async (req, res) => {
  try {
    const {
      name, quantity, needed, warehouse,
    } = req.body;
    // We need to set category to null if there's no input so Postgres doesn't cry about it
    const category = req.body.category ? req.body.category : null; // Category ID
    const newItem = await pool.query(`INSERT INTO item (name, quantity, needed, category_id, last_edited, warehouse_num) VALUES 
                                    ($1,
                                      $2, 
                                      $3, 
                                      $4, 
                                      (SELECT NOW()::timestamp),
                                      $5) RETURNING *`,
    [name, quantity, needed, category, warehouse]);
    res.send(newItem.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update an item
inventoryRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      quantity,
      needed,
      category,
    } = req.body;
    await db.query(`UPDATE item SET
                        last_edited = (SELECT NOW()::timestamp)
                        ${name ? ', name = $(editedName)' : ''}
                        ${parseInt(quantity, 10) >= 0 ? ', quantity = $(editedQuantity)' : ''}
                        ${parseInt(needed, 10) >= 0 ? ', needed = $(editedNeeded)' : ''}
                        ${category ? ', category_id = $(editedCategory)' : ', category_id = NULL'}
                      WHERE
                        id = $(id)`,
    {
      editedName: name,
      editedQuantity: quantity,
      editedNeeded: needed,
      editedCategory: category,
      id,
    });
    res.send(`Item with id ${id} was updated!`);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

// Delete an item
inventoryRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM item WHERE id = $1', [id]);
    res.send(`Item with id ${id} was deleted!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = inventoryRouter;
