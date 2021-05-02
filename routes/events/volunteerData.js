// Routes relating to events here
const express = require('express');

const volunteerDataRouter = express();
const pool = require('../../postgres/config');

volunteerDataRouter.use(express.json());

// Get Top 4 Volunteers for a given event
volunteerDataRouter.get('/top/', async (req, res) => {
  const { event } = req.query;
  try {
    const allEvents = await pool.query(`
      SELECT log_hours.userid,
        firstname,
        lastname,
        users.profile_picture,
        SUM (total_hours)
      FROM   log_hours
          INNER JOIN users
                  ON log_hours.userid = users.userid
      WHERE  log_hours.event_id = $1
      GROUP  BY log_hours.userid,
                firstname,
                lastname,
                users.profile_picture
      ORDER  BY Sum(total_hours) DESC
      LIMIT  4 
    `,
    [event]);
    res.status(200).send(allEvents.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Get all volunteers of a specific tier for a specific event
volunteerDataRouter.get('/all/', async (req, res) => {
  console.log('GET /volunteerData/all', req.query);
  const { event, sortingMethod } = req.query;
  const sortingDict = {
    0: '',
    1: 'ORDER BY USERS.firstname, USERS.lastname',
    2: 'ORDER BY USERS.firstname, USERS.lastname DESC',
    3: 'ORDER BY USERS.tier',
  };
  try {
    const allEvents = await pool.query(`
      SELECT users.*,
          permissions.permissions,
          Date_part('year', Age(users.birthdate)) :: INT,
          SUM(total_hours) :: INT
      FROM   users
          INNER JOIN permissions
                  ON permissions.userid = users.userid
          INNER JOIN log_hours
                  ON log_hours.userid = users.userid
          INNER JOIN user_event
                  ON user_event.event_id = log_hours.event_id
                    AND user_event.userid = log_hours.userid
      WHERE  user_event.event_id = $1
      GROUP  BY users.userid,
            permissions.permissions,
      $2
    `,
    [event, sortingDict[sortingMethod]]);
    res.status(200).send(allEvents.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = volunteerDataRouter;
