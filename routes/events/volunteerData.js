// Routes relating to events here
const express = require('express');

const volunteerDataRouter = express();
const pool = require('../../postgres/config');

volunteerDataRouter.use(express.json());

// Get Top 4 Volunteers for a given event
volunteerDataRouter.get('/top/', async (req, res) => {
  const { event } = req.query;
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

// Get all volunteers of a specific tier for a specific event
volunteerDataRouter.get('/all/', async (req, res) => {
  const { event, sortingMethod } = req.query;
  const sortingDict = {
    0: '',
    1: 'ORDER BY USERS.firstname, USERS.lastname',
    2: 'ORDER BY USERS.firstname, USERS.lastname DESC',
    3: 'ORDER BY USERS.tier',
  };
  try {
    const allEvents = await pool.query(`SELECT USERS.*,
                                          PERMISSIONS.PERMISSIONS,
                                          date_part('year', AGE(USERS.birthdate))::int,
                                          SUM(TOTAL_HOURS)::int
                                        FROM USERS
                                        INNER JOIN PERMISSIONS ON PERMISSIONS.USERID = USERS.USERID
                                        INNER JOIN LOG_HOURS ON LOG_HOURS.USERID = USERS.USERID
                                        INNER JOIN USER_EVENT ON USER_EVENT.EVENT_ID = LOG_HOURS.EVENT_ID AND USER_EVENT.USERID = LOG_HOURS.USERID
                                        WHERE USER_EVENT.EVENT_ID = $1
                                        GROUP BY 
                                          USERS.USERID,
                                          PERMISSIONS.PERMISSIONS,
                                        $2`,
    [event, sortingDict[sortingMethod]]);
    res.status(200).send(allEvents.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = volunteerDataRouter;
