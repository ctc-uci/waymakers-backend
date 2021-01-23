// Routes relating to events here
const express = require('express');

const eventRouter = express();
const pool = require('../../postgres/config');

eventRouter.use(express.json());

// Get all events
eventRouter.get('/', async (req, res) => {
  try {
    const allEvents = await pool.query('SELECT * FROM events');
    res.send(allEvents.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get top volunteers
eventRouter.get('/', async (req, res) => {
  try {
    const allEvents = await pool.query('SELECT * FROM events');
    res.send(allEvents.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get an event
eventRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const allEvents = await pool.query(`SELECT * FROM events WHERE event_id = '${id}'`);
    res.send(allEvents.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Add an event
eventRouter.post('/add', async (req, res) => {
  console.log(req.body);
  try {
    const {
      eventName, eventType, eventLocation, eventDescription, startTime, endTime, isAllDay,
    } = req.body;
    const lastEvent = await pool.query('SELECT * FROM events ORDER BY event_id DESC LIMIT 1');
    const eventID = Number(lastEvent.rows[0].event_id) + 1;
    const newEvent = await pool.query(`INSERT INTO events 
                                      (event_id, event_name, event_type, event_location, event_description, start_time, end_time, all_day) 
                                      VALUES ('${eventID}', '${eventName}', '${eventType}', '${eventLocation}', '${eventDescription}', '${startTime}', '${endTime}', '${isAllDay}') 
                                      RETURNING *`);
    res.send(newEvent.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Update an event
eventRouter.put('/:id', async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    console.log(req.params);
    const {
      eventName, eventType, eventLocation, eventDescription, startTime, endTime, isAllDay,
    } = req.body;
    await pool.query(`UPDATE events 
                      SET event_name = '${eventName}', 
                      event_type = '${eventType}', 
                      event_location = '${eventLocation}',
                      event_description = '${eventDescription}', 
                      start_time = '${startTime}', 
                      end_time = '${endTime}', 
                      all_day = '${isAllDay}' 
                      WHERE event_id = '${id}'`);
    res.send(`event with id ${id} was updated!`);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete an account
eventRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM events WHERE event_id = '${id}'`);
    res.send(`Event with id ${id} was deleted.`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = eventRouter;
