const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authRouter, verifyToken } = require('./routes/auth/auth');
// const db = require("./postgres/config.js");

require('dotenv').config();

// routes
const accountRouter = require('./routes/accounts/accounts');
const eventRouter = require('./routes/events/events');
const logRouter = require('./routes/events/logs');

const app = express();
const port = 3001;

const reactAppHost = process.env.WMK_REACT_APP_HOST;
const reactAppPort = process.env.WMK_REACT_APP_PORT;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cors({
  credentials: true,
  origin: `${reactAppHost}:${reactAppPort}`,
}));

app.use('/accounts', [verifyToken, accountRouter]);
app.use('/events', [verifyToken, eventRouter]);
app.use('/auth', authRouter);
app.use('/logs', logRouter);

app.listen(port, () => {
  console.log(`App listening at ${reactAppHost}:${port}`);
});
