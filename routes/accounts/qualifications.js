// routes relating to qualifications
const express = require('express');

const qualificationsRouter = express();
const pool = require('../../postgres/config');

qualificationsRouter.use(express.json());

// Get all qualification lists
qualificationsRouter.get('/', async (req, res) => {
  try {
    const allQualificationLists = await pool.query('SELECT * FROM qualification_list');
    res.send(allQualificationLists.rows);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get qualification list by id
qualificationsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Getting qualification_list with id: ${id}`);
  try {
    const qualification = await pool.query('SELECT * FROM qualification_list WHERE id = $1', [id]);
    res.send({
      qualification: qualification.rows,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get qualification list for a user, by their id
qualificationsRouter.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  console.log(`Getting qualification_list with userid: ${user_id}`);
  try {
    // Get users tier from users table
    const volunteer_query = await pool.query('SELECT tier FROM users WHERE userid = $1', [user_id]);
    const volunteer_tier = volunteer_query.rows[0].tier;

    // Fetch qualification list with matching volunteerTier
    const qualification = await pool.query('SELECT * FROM qualification_list WHERE volunteer_tier = $1', [volunteer_tier]);
    res.send({
      qualification: qualification.rows,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create qualification list
qualificationsRouter.post('/', async (req, res) => {
  try {
    const {
      volunteerTier,
    } = req.body;
    const newQualificationList = await pool.query(`
        INSERT INTO qualification_list(volunteer_tier, create_timestamp) VALUES
        ($1,
        (SELECT NOW()::timestamp)) RETURNING *`,
    [volunteerTier]);
    res.send({
      volunteerTier: newQualificationList.rows,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Edit qualification list by id
qualificationsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { volunteerTier } = req.body;
    console.log(`Editing qualification_list with id: ${id}`);
    if (id == null) res.status(400).send("Can't edit qualification_list without ID");
    await pool.query(`
      UPDATE qualification_list
      SET volunteer_tier = $1
      WHERE id = $2
    `, 
    [volunteerTier, id]);
    res.send(`Qualification with id ${id} was edited!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete qualification list by id
qualificationsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (id == null) res.status(400).send("Can't delete qualification_list without ID");
    await pool.query('DELETE FROM qualification_list WHERE id = $1 RETURNING *', [id]);
    res.send(`Qualification with id ${id} was deleted!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// delete qualification
qualificationsRouter.delete('/qualification', async(req, res) => {
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
    const {id, name, question} = req.body;
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
    res.status(400).send(`Qualification with id ${id} does not exist`);
  }
})

module.exports = qualificationsRouter;