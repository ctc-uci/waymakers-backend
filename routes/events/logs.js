// Routes relating to events here
const express = require('express');

const logRouter = express();
const pool = require('../../postgres/config');

logRouter.use(express.json());

function convertLogSnakeToCamel(logs) {
  return logs.map((log) => ({
    logId: log.log_id,
    userId: log.userid,
    eventId: log.event_id,
    logStart: log.log_start,
    logEnd: log.log_end,
    totalHours: log.total_hours,
    additionalNotes: log.additional_notes,
  }));
}

// Get all logs
logRouter.get('/', async (req, res) => {
  try {
    const logs = await pool.query(`SELECT log_hours.*, events.* 
                                FROM log_hours
                                INNER JOIN events 
                                ON log_hours.event_id = events.event_id;`);
    // logs = convertLogSnakeToCamel(logs.rows);
    res.status(200).send(logs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Add log for user's event hours
logRouter.post('/add', async (req, res) => {
  console.log(req.body);
  try {
    const {
      userId, eventId, logStart, logEnd, totalHours, additionalNotes,
    } = req.body;
    const response = await pool.query(`INSERT INTO log_hours
                        (userid, event_id, log_start, log_end, total_hours, additional_notes) 
                        VALUES ('${userId}', ${eventId}, '${logStart}', '${logEnd}', ${totalHours}, '${additionalNotes}')
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

// Get log for user id
logRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    let userLogs = await pool.query(`SELECT * FROM log_hours WHERE userid='${id}'`);
    userLogs = convertLogSnakeToCamel(userLogs.rows);
    if (userLogs.length === 0) {
      res.status(400).send(userLogs);
    } else {
      res.status(200).send(userLogs);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = logRouter;
