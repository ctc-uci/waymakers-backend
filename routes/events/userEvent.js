// Routes relating to user events here
const express = require('express');

const userEventRouter = express();
const pool = require('../../postgres/config');

userEventRouter.use(express.json());

function convertEventsSnakeToCamel(userEvents) {
  return userEvents.map((userEvent) => ({
    title: userEvent.event_name,
    startTime: userEvent.start_time,
    endTime: userEvent.end_time,
    division: userEvent.division,
    eventLimit: userEvent.event_limit,
    eventAttendance: userEvent.event_attendance,
    location: userEvent.event_location,
    description: userEvent.event_description,
    id: userEvent.event_id,
  }));
}

// Get all user events by user ID
userEventRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let userEvents = await pool.query(`SELECT user_event.userid, events.* 
                                        FROM user_event
                                        INNER JOIN events
                                        ON user_event.event_id = events.event_id
                                        WHERE userid = '${id}';`);
    userEvents = convertEventsSnakeToCamel(userEvents.rows);
    res.status(200).send(userEvents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Add event to user's calendar
userEventRouter.post('/add', async (req, res) => {
  try {
    const {
      userId, eventId,
    } = req.body;
    const checker = await pool.query(`SELECT * FROM user_event WHERE userid = '${userId}' AND event_id = ${eventId}`);
    if (checker.rowCount !== 0) {
      res.status(400).send('Event already already in database');
      return;
    }
    let response = await pool.query(`INSERT INTO user_event 
                                    (userid, event_id) 
                                    VALUES (
                                      '${userId}', 
                                      ${eventId})
                                    RETURNING *`);
    if (response.rowCount === 0) {
      res.status(400).send(response);
    }
    response = response.rows.map((e) => ({
      userId: e.userid,
      eventId: e.event_id,
    }));
    res.status(200).send(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Remove user event by event ID
userEventRouter.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await pool.query('SELECT * FROM events ORDER BY start_time ASC;');
    res.status(200).send(deletedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Update route later?

//

module.exports = userEventRouter;
