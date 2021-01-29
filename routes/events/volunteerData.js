// Routes relating to events here
const express = require('express');

const volunteerDataRouter = express();
const pool = require('../../postgres/config');

volunteerDataRouter.use(express.json());

// Get Top 4 Volunteers
volunteerDataRouter.get('/top/', async (req, res) => {
  const { event } = req.query;
  // console.log(event);
  try {
    const allEvents = await pool.query(`SELECT log_hours.userid, firstname, lastname, SUM(total_hours) FROM log_hours
                                        INNER JOIN users ON
                                            log_hours.userid=users.userid
                                        WHERE
                                          log_hours.event_id = $1
                                        GROUP BY
                                            log_hours.userid,
                                            firstname,
                                            lastname
                                        ORDER BY
                                            SUM(total_hours) DESC
                                        LIMIT 4`,
    [event]);
    res.status(200).send(allEvents.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Get all volunteers
volunteerDataRouter.get('/all/', async (req, res) => {
  const { event } = req.query;
  console.log(event);
  try {
    const allEvents = await pool.query(`SELECT users.firstname, users.lastname, users.userid
                                            FROM user_event
                                            INNER JOIN users ON
                                            user_event.userid=users.userid
                                            WHERE user_event.event_id=${event};`);
    res.status(200).send(allEvents.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = volunteerDataRouter;
