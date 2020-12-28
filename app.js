const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const db = require("./postgres/config.js");

// routes
const inventoryRoutes = require('./routes/inventory/inventory');
const accountRouter = require('./routes/accounts/accounts');
const categoryRouter = require('./routes/inventory/category');
const divisionRouter = require('./routes/inventory/divisions');
const eventRouter = require('./routes/events/events');

const app = express();
const port = 3000;

// Enabling CORS - Only for development
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/inventory', inventoryRoutes);
app.use('/accounts', accountRouter);
app.use('/category', categoryRouter);
app.use('/divisions', divisionRouter);
app.use('/events', eventRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
