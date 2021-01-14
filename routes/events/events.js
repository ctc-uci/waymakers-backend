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

// Get an event
eventRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await pool.query(`SELECT * FROM events WHERE eventid = ${id}::varchar`);
    res.send(event.rows);
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
    const lastEvent = await pool.query('SELECT * FROM events ORDER BY eventid DESC LIMIT 1');
    const eventID = Number(lastEvent.rows[0].event_id) + 1;
    const newEvent = await pool.query(`INSERT INTO events 
                                      (eventid, eventname, eventtype, eventlocation, eventdescription, starttime, endtime, allday) 
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
                      SET eventName = '${eventName}', 
                      eventType = '${eventType}', 
                      eventLocation = '${eventLocation}',
                      eventDescription = '${eventDescription}', 
                      startTime = '${startTime}', 
                      endTime = '${endTime}', 
                      allDay = '${isAllDay}' 
                      WHERE eventId = '${id}'`);
    res.send(`event with id ${id} was updated!`);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete an account
eventRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM events WHERE eventid = '${id}'`);
    res.send(`Event with id ${id} was deleted.`);
  } catch (err) {
    console.error(err.message);
  }
});

// Add log for user's event hours
eventRouter.post('/loghours', async (req, res) => {
  console.log(req.body);
  try {
    const {
      userId, eventId, logStart, logEnd, totalHours, additionalnotes, division,
    } = req.body;
    await pool.query(`INSERT INTO loghours
                    (userid, eventid, logstart, logend, totalhours, additionalnotes, division) 
                    VALUES ('${userId}', '${eventId}', '${logStart}', '${logEnd}', '${totalHours}', '${additionalnotes}', '${division}')`);
    res.send(`Added log for userId ${userId}`);
  } catch (err) {
    console.error(err.message);
  }
});

// Get log for user id
eventRouter.get('/log/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userLogs = await pool.query(`SELECT * FROM loghours WHERE userid='${id}'`);
    res.send(userLogs.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = eventRouter;
