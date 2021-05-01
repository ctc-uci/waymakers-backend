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
    eventType: event.event_type,
    eventLimit: event.event_limit,
    eventAttendance: event.event_attendance,
    location: event.event_location,
    description: event.event_description,
    id: event.event_id,
    isAllDay: event.all_day,
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
    let event = await pool.query(`SELECT *
                                  FROM events WHERE event_id = $1`,
    [id]);
    console.log(event.rows);
    event = convertEventSnakeToCamel(event.rows);
    console.log(event);
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
      eventName,
      eventLocation,
      eventDescription,
      startTime,
      endTime,
      isAllDay,
      eventType,
      division,
      eventLimit,
    } = req.body;
    const response = await pool.query(`INSERT INTO events 
                      (event_name, event_location, event_description, start_time, end_time, all_day, event_type, division, event_limit, event_attendance) 
                      VALUES (
                         $1, 
                         $2, 
                         $3, 
                         $4, 
                         $5, 
                         $6, 
                         $7,
                         $8,
                         $9,
                         0)
                      RETURNING *`,
    [
      eventName,
      eventLocation,
      eventDescription,
      startTime,
      endTime,
      isAllDay,
      eventType,
      division,
      eventLimit,
    ]);
    if (response.rowCount === 0) {
      res.status(400).send(response);
    } else {
      const event = convertEventSnakeToCamel(response.rows);
      res.status(200).send(event);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Update an event
eventRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      eventName,
      eventLocation,
      eventDescription,
      startTime,
      endTime,
      isAllDay,
      eventType,
      division,
      eventLimit,
    } = req.body;
    const response = await pool.query(`UPDATE events 
                      SET event_name = $1, 
                      event_location = $2, 
                      event_description = $3,
                      start_time = $4, 
                      end_time = $5, 
                      all_day = $6,
                      event_type = $7,
                      division = $8,
                      event_limit = $9
                      WHERE event_id = $10
                      RETURNING *`,
    [
      eventName,
      eventLocation,
      eventDescription,
      startTime,
      endTime,
      isAllDay,
      eventType,
      division,
      eventLimit,
      id,
    ]);
    if (response.rowCount === 0) {
      res.status(400).send();
    } else {
      const event = convertEventSnakeToCamel(response.rows);
      res.status(200).send(event);
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
    const response = await pool.query('DELETE FROM events WHERE event_id = $1 RETURNING *', [id]);
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
