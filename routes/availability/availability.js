const express = require('express');

const availabilityRouter = express();
const pool = require('../../postgres/config');

availabilityRouter.use(express.json());

availabilityRouter.get('/', async (req, res) => {
  try {
    const allAvailability = await pool.query('SELECT * FROM availability;');
    res.status(200).send(allAvailability);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

availabilityRouter.get('/:id', async (req, res) => {
  console.log('request made to availability get route');

  const { id } = req.params;
  try {
    const availability = await pool.query(`SELECT * FROM availability WHERE userid = '${id}'`);
    res.status(200).send({
      userAvailability: availability.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

availabilityRouter.post('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      dates,
    } = req.body;

    const deletedRows = await pool.query(`DELETE FROM availability WHERE userid = '${id}' RETURNING *`);
    console.log(`deleted ${deletedRows.rowCount} rows from availability`);

    // if dates is empty, return response after deleting all events
    if (dates.length === 0) {
      res.status(200).send('Availability cleared!');
    }

    const mapDates = () => {
      const formattedDates = dates.map((date) => (`('${id}', ${date[0]}, '${date[1]}')`));
      return formattedDates.join(', \n');
    };
    const queryString = `
    INSERT INTO availability (userid, dayofweek, starttime)
    VALUES ${mapDates()} RETURNING dayofweek, starttime;`;

    console.log(queryString);

    const newAvailability = await pool.query(queryString);

    res.status(200).send({
      newAvailability: newAvailability.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

availabilityRouter.delete('/:id', async (req, res) => {
  console.log('can delete');
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM availability WHERE userid = '${id}'`);
    res.send(`Availability for account with id ${id} was deleted.`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = availabilityRouter;
