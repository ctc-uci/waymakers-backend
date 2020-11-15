const express = require('express');
const bodyParser = require('body-parser');
// const db = require("./postgres/config.js");

// routes
const accountRouter = require('./routes/accounts/accounts');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/accounts', accountRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
