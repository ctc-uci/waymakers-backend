const { Pool } = require('pg');
require('dotenv').config({ path: `${__dirname}/.env` });

/**
const pool = new Pool({
  user: "wmk_dev",
  host: "waymakers-dev-db.c3g5iuul9ddg.us-west-1.rds.amazonaws.com",
  database: "postgres",
  password: "CHANG1NGtheWoRld2021",
  port: 5432
});
*/
/**
const pool = new Pool({
  user: 'postgres',
  password: 'ctc123',
  host: 'localhost',
  port: 5432,
  database: 'inventory_database',
});
*/

const pool = new Pool({
  user: process.env.REACT_APP_AWS_USER,
  host: process.env.REACT_APP_AWS_HOST,
  database: process.env.REACT_APP_AWS_DATABASE,
  password: process.env.REACT_APP_AWS_PASSWORD,
  port: process.env.REACT_APP_AWS_PORT,
});

console.log(process.env.REACT_APP_AWS_USER);
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
