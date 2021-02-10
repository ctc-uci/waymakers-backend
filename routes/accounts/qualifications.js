// routes relating to qualifications
const express = require('express');

const qualificationsRouter = express();
const pool = require('../../postgres/config');

qualificationsRouter.use(express.json());

// Get qualification list by id
qualificationsRouter.get('/', async (req, res) => {
const { id } = req.params;
try {
    const qualification = await pool.query(`SELECT * FROM qualification_list WHERE id = $1`, [id]);
    res.send({
        qualification: qualification.rows
    })
    
} catch(err) {
    res.status(400).send(err.message);
}
});

// Create qualification list
qualificationsRouter.post('/', async (req, res) => {
    try {
      const {
        volunteerTier
      } = req.body;
      const newQualificationList = await pool.query(`
        INSERT INTO qualification_list(volunteer_tier, create_timestamp) VALUES
        ($1,
        (SELECT NOW()::timestamp)) RETURNING *`
        [volunteerTier]);
      res.send({
        volunteerTier: newQualificationList.rows,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

// Edit qualification list
qualificationsRouter.put('/', async(req, res) => {
    try {
        
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete qualification list
qualificationsRouter.delete('/', async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM item WHERE id = $1', [id]);
        res.send(`Qualification with id ${id} was deleted!`);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = qualificationsRouter;