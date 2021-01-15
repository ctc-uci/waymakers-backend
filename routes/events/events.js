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
    eventType: event.event_type,
    location: event.event_location,
    description: event.event_description,
    id: event.event_id,
  }));
}

// Get all events
eventRouter.get('/', async (req, res) => {
  try {
    // await pool.query(`SET TIMEZONE = 'America/Los_Angeles';`);
    let allEvents = await pool.query('SELECT * FROM events;');
    // let i = new Date(allEvents.rows[0].start_time);
    // i = i.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    // console.log(i);
    // console.log("HELLO");
    allEvents = convertEventSnakeToCamel(allEvents.rows);
    res.send(allEvents);
  } catch (err) {
    console.error(err.message);
  }
});

// Get an event
eventRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let event = await pool.query(`SELECT * FROM events WHERE event_id = ${id}`);
    event = convertEventSnakeToCamel(event.rows);
    res.send(event);
  } catch (err) {
    console.error(err.message);
  }
});

// Add an event
eventRouter.post('/add', async (req, res) => {
  console.log(req.body);
  try {
    const {
      eventName, eventLocation, eventDescription, startTime, endTime, isAllDay, division,
    } = req.body;

    await pool.query(`INSERT INTO events 
                      (event_name, event_location, event_description, start_time, end_time, all_day, division) 
                      VALUES ('${eventName}', '${eventLocation}', '${eventDescription}', '${startTime}', '${endTime}', '${isAllDay}', '${division}')`);
    res.send(`${eventName} added!`);
  } catch (err) {
    res.send(err.message);
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
      eventName, eventLocation, eventDescription, startTime, endTime, isAllDay, division,
    } = req.body;
    await pool.query(`UPDATE events 
                      SET event_name = '${eventName}', 
                      event_location = '${eventLocation}', 
                      event_description = '${eventDescription}',
                      start_time = '${startTime}', 
                      end_time = '${endTime}', 
                      all_day = '${isAllDay}',
                      division = '${division}' 
                      WHERE event_id = ${id}`);
    res.send(`event with id ${id} was updated!`);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete an event
eventRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM events WHERE event_id = ${id}`);
    res.send(`Event with id ${id} was deleted.`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = eventRouter;
