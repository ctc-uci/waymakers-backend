const express = require('express');
const bodyParser = require('body-parser');
// const db = require("./postgres/config.js");

// routes
const inventoryRoutes = require('./routes/inventory/inventory');
const accountRouter = require('./routes/accounts/accounts');
const categoryRouter = require('./routes/inventory/category');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/inventory', inventoryRoutes);
app.use('/accounts', accountRouter);
app.use('/category', categoryRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
