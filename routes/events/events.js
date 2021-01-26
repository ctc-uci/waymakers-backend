// Routes relating to events here
const express = require('express');

const eventRouter = express();
const pool = require('../../postgres/config');

eventRouter.use(express.json());

function convertEventSnakeToCamel(events) {
  return events.map((event) => ({
    title: event.event_name,
    startTime: event.start_time,
    endTime: event.end_time,
    division: event.division,
    location: event.event_location,
    description: event.event_description,
    id: event.event_id,
  }));
}

// Get all events
eventRouter.get('/', async (req, res) => {
  try {
    let allEvents = await pool.query('SELECT * FROM events ORDER BY start_time ASC;');
    allEvents = convertEventSnakeToCamel(allEvents.rows);
    res.status(200).send(allEvents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Get an event
eventRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let event = await pool.query(`SELECT * FROM events WHERE event_id = ${id}`);
    event = convertEventSnakeToCamel(event.rows);
    if (event.length === 0) {
      res.status(400).send(event);
    } else {
      res.status(200).send(event);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Add an event
eventRouter.post('/add', async (req, res) => {
  console.log(req.body);
  try {
    const {
      eventName, eventLocation, eventDescription, startTime, endTime, isAllDay, division,
    } = req.body;
    const response = await pool.query(`INSERT INTO events 
                      (event_name, event_location, event_description, start_time, end_time, all_day, division) 
                      VALUES ('${eventName}', '${eventLocation}', '${eventDescription}', '${startTime}', '${endTime}', '${isAllDay}', '${division}')
                      RETURNING *`);
    if (response.rowCount === 0) {
      res.status(400).send(response);
    } else {
      res.status(200).send(response);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Update an event
eventRouter.put('/:id', async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    console.log(req.params);
    const {
      eventName, eventLocation, eventDescription, startTime, endTime, isAllDay, division,
    } = req.body;
    const response = await pool.query(`UPDATE events 
                      SET event_name = '${eventName}', 
                      event_location = '${eventLocation}', 
                      event_description = '${eventDescription}',
                      start_time = '${startTime}', 
                      end_time = '${endTime}', 
                      all_day = '${isAllDay}',
                      division = '${division}' 
                      WHERE event_id = ${id}
                      RETURNING *`);
    if (response.rowCount === 0) {
      res.status(400).send();
    } else {
      res.status(200).send(response);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Delete an event
eventRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await pool.query(`DELETE FROM events WHERE event_id = ${id} RETURNING *`);
    if (response.rowCount === 0) {
      res.status(400).send();
    } else {
      res.status(200).send(response);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = eventRouter;
