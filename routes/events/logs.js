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
    title: log.event_name,
    location: log.event_location,
    logStart: log.log_start,
    logEnd: log.log_end,
    totalHours: log.total_hours,
    additionalNotes: log.additional_notes,
  }));
}

// Get all logs
logRouter.get('/', async (req, res) => {
  try {
    let logs = await pool.query(`SELECT log_hours.*, events.* 
                                FROM log_hours
                                INNER JOIN events 
                                ON log_hours.event_id = events.event_id;`);
    logs = convertLogSnakeToCamel(logs.rows);
    res.status(200).send(logs);
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
    console.log(req.body);
    const response = await pool.query(`INSERT INTO log_hours
                        (userid, event_id, log_start, log_end, total_hours, additional_notes, log_status) 
                        VALUES ($1, $2, $3, $4, $5, $6, 'approved')
                        RETURNING *`, [userId, eventId, logStart, logEnd, totalHours, additionalNotes]);
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

// Update log for user's event hours
logRouter.put('/update', async (req, res) => {
  console.log(req.body);
  try {
    const {
      userId, eventId, logStart, logEnd, totalHours, additionalNotes,
    } = req.body;
    console.log(req.body);
    const response = await pool.query(`UPDATE log_hours 
                      SET userid = $1, 
                      event_id = $2, 
                      log_start = $3,
                      log_end = $4, 
                      total_hours = $5, 
                      additional_notes = $6,
                      log_status = 'approved'
                      WHERE userid = $1 AND event_id = $2
                      RETURNING *`, [userId, eventId, logStart, logEnd, totalHours, additionalNotes]);
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

// DEPRECATED
// Resubmit a rejected hour
// logRouter.post('/resubmitRejected', async (req, res) => {
//   try {
//     const {
//       logId, logStart, logEnd, totalHours, additionalNotes,
//     } = req.body;
//     const response = await pool.query(`
//         UPDATE log_hours
//         SET log_start = $1, log_end = $2, total_hours = $3, additional_notes = $4,
//            log_status = 'pending', rejected_notes = ''
//         WHERE log_id = $5`, [logStart, logEnd, totalHours, additionalNotes, logId]);
//     if (response.rowCount === 0) {
//       res.status(400).send(response);
//     } else {
//       res.status(200).send(response);
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send(err.message);
//   }
// });

// DEPRECATED
// Get logs that are pending / in review
// logRouter.get('/rejected', async (req, res) => {
//   const { userId } = req.query;

//   try {
//     const logs = await pool.query(`SELECT log_hours.*, events.*
//                                   FROM log_hours
//                                   INNER JOIN events
//                                   ON log_hours.event_id = events.event_id
//                                   WHERE log_hours.log_status = 'rejected'
//                                   AND log_hours.userid = $1
//                                   `, [userId]);

//     const out = logs.rows.map((row) => ({
//       id: row.log_id,
//       eventName: row.event_name,
//       startTime: row.log_start,
//       endTime: row.log_end,
//       rejectedNotes: row.rejected_notes,
//       eventType: row.event_type,
//       location: row.event_location,
//       additionalNotes: row.additional_notes,
//       division: row.division,
//     }));

//     res.status(200).send(out);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send(err.message);
//   }
// });

// DEPRECATED
// Remove rejected hour
// logRouter.post('/removeRejected', async (req, res) => {
//   const { userId } = req.query;
//   const { logId } = req.body;

//   try {
//     const logs = await pool.query(`DELETE FROM log_hours
//                                    WHERE log_id = $1
//                                    AND userid = $2
//                                    AND log_status = 'rejected'
//                                    RETURNING *
//                                   `, [logId, userId]);

//     if (logs.rowCount === 0) {
//       res.status(400).send();
//     } else {
//       res.status(200).send();
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send(err.message);
//   }
// });

// DEPRECATED
// Get logs that are pending / in review
// logRouter.get('/pending', async (req, res) => {
//   const { userId } = req.query;

//   try {
//     const logs = await pool.query(`SELECT log_hours.*, events.*
//                                   FROM log_hours
//                                   INNER JOIN events
//                                   ON log_hours.event_id = events.event_id
//                                   WHERE log_hours.log_status = 'pending'
//                                   AND log_hours.userid = $1
//                                   `, [userId]);
//     const out = logs.rows.map((row) => ({
//       eventName: row.event_name,
//       location: row.event_location,
//       startTime: row.log_start,
//       endTime: row.log_end,
//       hours: row.total_hours,
//     }));

//     res.status(200).send(out);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send(err.message);
//   }
// });

// Get unsubmitted hours of specific users
logRouter.get('/unsubmitted', async (req, res) => {
  const { userId } = req.query;

  try {
    const logs = await pool.query(` SELECT events.* 
                                    FROM events
                                    INNER JOIN 
                                      (select event_id
                                      from user_event
                                      where userid = $1
                                      except
                                      select lh.event_id
                                      from log_hours lh
                                      where lh.userid = $1) as ue
                                    on events.event_id = ue.event_id`, [userId]);

    const out = logs.rows.map((row) => ({
      id: row.event_id,
      title: row.event_name,
      location: row.event_location,
      startTime: row.start_time,
      endTime: row.end_time,
      eventType: row.event_type,
      division: row.division,
    }));

    res.status(200).send(out);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

// Get approved hours of a specific users
logRouter.get('/submitted', async (req, res) => {
  // TODO: validate userId exists
  const {
    userId,
  } = req.query;

  try {
    const logs = await pool.query(`SELECT log_hours.*, events.* 
                                FROM log_hours
                                INNER JOIN events 
                                ON log_hours.event_id = events.event_id
                                WHERE log_hours.userid = $1
                                AND log_hours.log_status = 'approved'`, [userId]);

    const out = logs.rows.map((row) => ({
      eventId: row.event_id,
      eventName: row.event_name,
      location: row.event_location,
      startTime: row.log_start,
      endTime: row.log_end,
      hours: row.total_hours,
    }));

    res.status(200).send(out);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Get summation of a user's submitted hours per event type
logRouter.get('/approved/sum', async (req, res) => {
  console.log('GET /approved/sum in', req.query);
  const { userId, type } = req.query;

  try {
    const sum = await pool.query(`
      SELECT SUM (total_hours)
      FROM   log_hours
            INNER JOIN events
                    ON ( log_hours.event_id = events.event_id )
      WHERE  log_hours.userid = $1
            AND log_hours.log_status = 'approved'
            AND events.event_type = $2 
    `, [userId, type]);

    res.status(200).send(sum.rows[0].sum);
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
});

// Get all logs
// TODO: add another sub layer (/logs/find/:id) so it doesn't collide
// eg. /logs/add can be captured here
logRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let logs = await pool.query(`SELECT log_hours.*, events.* 
                                FROM log_hours
                                INNER JOIN events 
                                ON log_hours.event_id = events.event_id
                                WHERE log_hours.userid = '${id}'`);
    logs = convertLogSnakeToCamel(logs.rows);
    res.status(200).send(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = logRouter;
