const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authRouter, verifyToken } = require('./routes/auth/auth');
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

app.use('/accounts', [verifyToken, accountRouter]);
app.use('/events', [verifyToken, eventRouter]);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
