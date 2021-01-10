const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const db = require("./postgres/config.js");

// routes
const accountRouter = require('./routes/accounts/accounts');
const eventRouter = require('./routes/events/events');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cors());

app.use('/accounts', accountRouter);
app.use('/events', eventRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
