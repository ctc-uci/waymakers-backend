// routes relating to qualifications
const express = require('express');

const qualificationsRouter = express();
const pool = require('../../postgres/config');

qualificationsRouter.use(express.json());

// Get all qualifications and their statues for a user, by the user's id
qualificationsRouter.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  console.log(`Getting qualification_list with userid: ${user_id}`);
  try {
    // Join query with qualification and qualification_status tables
    const userQualificationQuery = await pool.query(`
        SELECT
          qualification.id,
          qualification.qualification_name,
          qualification.qualification_description,
          qualification.volunteer_tier,
          qualification_status.user_id,
          qualification_status.completion_status,
          qualification_status.completion_timestamp,
          qualification_status.notes
        FROM
          qualification_status
        INNER JOIN qualification ON qualification_status.qualification_id = qualification.id
        WHERE
          qualification_status.user_id = $1;
    `, [user_id]);

    res.send(userQualificationQuery.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create qualification
qualificationsRouter.post('/', async (req, res) => {
  try {
    const {
      name, description, volunteer_tier
    } = req.body;
    const qualification = await pool.query(`
        INSERT INTO qualification(qualification_name, qualification_description, volunteer_tier) VALUES
        ($1, $2, $3) RETURNING *`,
    [name, description, volunteer_tier]);
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
    if (id == null) res.status(400).send("Can't delete qualification_list without ID");
    await pool.query('DELETE FROM qualification WHERE id = $1 RETURNING *', [id]);
    res.send(`Qualification with id ${id} was deleted!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Edit qualification 
qualificationsRouter.put('/', async(req, res) => {
  try {
    const { id, name, description } = req.body;
    console.log(id);
    console.log(name);
    console.log(description);
    if (id == null) res.status(400).send("Can't edit qualification without ID");
    await pool.query(`
      UPDATE qualification
      SET
        qualification_name = $2
        qualification_description = $3
      WHERE
        id = $1
    `,
    [id, name, description]);
    res.send(`Account with id ${id} was updated!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

// Update qualification status
qualificationsRouter.put('/status', async (req, res) => {
  try {
    const {
      user_id, qualification_id, completion_status
    } = req.body;
    console.log(`Setting qualification_status of user: ${user_id} with qualification_id: ${qualification_id} to: ${completion_status}`);
    if (user_id == null) res.status(400).send("Can't update qualification_status without user_id");
    else if (qualification_id == null) res.status(400).send("Can't update qualification_status without qualification_id");
    else if (completion_status == null) res.status(400).send("Can't update qualification_status without completion_status");
    await pool.query(`
      UPDATE qualification_status
      SET
        completion_status = $1
        completion_timestamp = SELECT NOW()::timestamp
      WHERE
        user_id = $2 AND
        qualification_id = $3
    `, 
    [completion_status, user_id, qualification_id]);
    res.send(`Qualification_status of user ${user_id} with qualification_id ${qualification_id} was updated`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = qualificationsRouter;
