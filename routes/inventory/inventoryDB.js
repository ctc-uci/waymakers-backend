// THIS FILE CONNECTS THE SERVER TO OUR POSTGRESQL DATABASE

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'YOUR_MASTER_PASSWORD',
  database: 'inventory_database',
  host: 'localhost',
  port: 5432,
});

module.exports = pool;
