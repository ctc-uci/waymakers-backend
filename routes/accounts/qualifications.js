// routes relating to qualifications
const express = require('express');

const qualificationsRouter = express();
const pool = require('../../postgres/config');

qualificationsRouter.use(express.json());

// Get qualification list for a user, by their id TODO: CHANGE TO USE qualification_status TABLE ONCE TRIGGERS ARE SETUP
qualificationsRouter.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  console.log(`Getting qualification_list with userid: ${user_id}`);
  try {
    // Join query with qualification and qualification_status tables
    const userQualificationQuery = await pool.query(`
        SELECT
          qualification.id,
          qualification.name,
          qualification.question,
          qualification.qualificationlistid,
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

qualificationsRouter.post('/qualification', async (req, res) => {
  try {
    const {
      name, question, qualificationlistid,
    } = req.body;
    const qualification = await pool.query(`
        INSERT INTO qualification(name, question, qualificationlistid) VALUES
        ($1, $2, $3) RETURNING *`,
    [name, question, qualificationlistid]);
    res.send(
      qualification.rows,
    );
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete qualification
qualificationsRouter.delete('/qualification', async (req, res) => {
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
qualificationsRouter.put('/qualification', async(req, res) => {
  try {
    const { id, name, question } = req.body;
    console.log(id);
    console.log(name);
    console.log(question);
    if (id == null) res.status(400).send("Can't edit qualification without ID");
    const userQuery = `
UPDATE qualification
  SET ${name ? `name = '${name}', ` : ''}
      ${question ? `question = '${question}' ` : ''}
  WHERE id = ${id}
    `;
    await pool.query(userQuery);
    res.send(`Account with id ${id} was updated!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

// Update qualification status
// TODO: Use sql triggers to populate/update qualification status table with each users qualifications
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
