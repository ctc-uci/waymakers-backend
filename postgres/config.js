const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.REACT_APP_AWS_USER,
  host: process.env.REACT_APP_AWS_HOST,
  database: process.env.REACT_APP_AWS_DATABASE,
  password: process.env.REACT_APP_AWS_PASSWORD,
  port: process.env.REACT_APP_AWS_PORT,
});

module.exports = pool;

// Example testing to connect to AWS
// pool.query(
//   // "CREATE TABLE Persona(PersonID int,LastName varchar(255));",
//   // "DROP TABLE Persona;",
//   (err, res) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//     client.end();
//   }
// );
