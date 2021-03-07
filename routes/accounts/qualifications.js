// routes relating to qualifications
const express = require('express');

const qualificationsRouter = express();
const pool = require('../../postgres/config');

qualificationsRouter.use(express.json());

// Get all qualifications and their statues for a user, by the user's id
qualificationsRouter.get('/user/:userID', async (req, res) => {
  const { userID } = req.params;
  console.log(`Getting qualification statues for userid: ${userID}`);
  try {
    // Join query with qualification and qualificationStatus tables
    const userQualificationQuery = await pool.query(`
        SELECT
          qualification.id,
          qualification.qualification_name,
          qualification.qualification_description,
          qualification.volunteerTier,
          qualificationStatus.userID,
          qualificationStatus.completionStatus,
          qualificationStatus.completion_timestamp,
          qualificationStatus.notes
        FROM
          qualificationStatus
        INNER JOIN qualification ON qualificationStatus.qualificationID = qualification.id
        WHERE
          qualificationStatus.userID = $1;
    `, [userID]);

    res.send(userQualificationQuery.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all qualifications
qualificationsRouter.get('/', async (req, res) => {
  try {
    const qualifications = await pool.query(`
        SELECT * FROM qualification
        ORDER BY
        volunteerTier ASC, id ASC
    `);
    res.send(qualifications.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get incomplete qualifications
qualificationsRouter.get('/:incomplete', async (req, res) => {
  const { id } = req.params;
  console.log(`Getting volunteers who need qualifications reviewed ${id}`);
  try {
    const qualification = await pool.query('SELECT $1 FROM qualificationStatus WHERE completionStatus=$2', [id, false]);
    res.send(qualification.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create qualification
qualificationsRouter.post('/', async (req, res) => {
  try {
    const {
      name, description, volunteerTier,
    } = req.body;
    const qualification = await pool.query(`
        INSERT INTO qualification(qualification_name, qualification_description, volunteerTier) VALUES
        ($1, $2, $3) RETURNING *`,
    [name, description, volunteerTier]);
    res.send(
      qualification.rows,
    );
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete qualification
qualificationsRouter.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    if (id == null) res.status(400).send("Can't delete qualification without ID");
    await pool.query('DELETE FROM qualification WHERE id = $1 RETURNING *', [id]);
    res.send(`Qualification with id ${id} was deleted!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Edit qualification
// TODO: Add trigger to update qualificationStatus table when volunteerTier changes
qualificationsRouter.put('/', async (req, res) => {
  try {
    const { id, name, description } = req.body;
    console.log(id);
    console.log(name);
    console.log(description);
    if (id == null) res.status(400).send("Can't edit qualification without ID");
    await pool.query(`
      UPDATE qualification
      SET
        qualification_name = $2,
        qualification_description = $3
      WHERE
        id = $1
    `,
    [id, name, description]);
    res.send(`Account with id ${id} was updated!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update qualification status
qualificationsRouter.put('/status', async (req, res) => {
  try {
    const {
      userID, qualificationID, completionStatus,
    } = req.body;
    console.log(`Setting qualificationStatus of user: ${userID} with qualificationID: ${qualificationID} to: ${completionStatus}`);
    if (userID == null) res.status(400).send("Can't update qualificationStatus without userID");
    else if (qualificationID == null) res.status(400).send("Can't update qualificationStatus without qualificationID");
    else if (completionStatus == null) res.status(400).send("Can't update qualificationStatus without completionStatus");
    await pool.query(`
      UPDATE qualificationStatus
      SET
        completionStatus = $1
        completion_timestamp = SELECT NOW()::timestamp
      WHERE
        userID = $2 AND
        qualificationID = $3
    `,
    [completionStatus, userID, qualificationID]);
    res.send(`Qualification_status of user ${userID} with qualificationID ${qualificationID} was updated`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = qualificationsRouter;
