const express = require('express');
const bodyParser = require('body-parser');

// Adding CORS so node server can be run on localhost
const cors = require('cors');

// const db = require("./postgres/config.js");

// routes
const inventoryRoutes = require('./routes/inventory/inventory');
const accountRouter = require('./routes/accounts/accounts');

const app = express();
const port = 3000;

// Enabling CORS - Only for development
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/inventory', inventoryRoutes);
app.use('/accounts', accountRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
