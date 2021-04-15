const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authRouter, verifyToken } = require('./routes/auth/auth');
// const db = require("./postgres/config.js");

require('dotenv').config();

// routes
const inventoryRouter = require('./routes/inventory/inventory');
const accountRouter = require('./routes/accounts/accounts');
const availabilityRouter = require('./routes/availability/availability');
const categoryRouter = require('./routes/inventory/category');
const divisionRouter = require('./routes/inventory/divisions');
const warehouseRouter = require('./routes/inventory/warehouse');
const eventRouter = require('./routes/events/events');
const volunteerDataRouter = require('./routes/events/volunteerData');
const logRouter = require('./routes/events/logs');
const userEventRouter = require('./routes/events/userEvent');
const registerRouter = require('./routes/register/register');

const app = express();

let port;

if (process.env.NODE_ENV === 'production') {
  // passed in from heroku
  port = process.env.PORT;
} else {
  port = 3001;
}

const reactAppHost = process.env.WMK_REACT_APP_HOST;
const reactAppPort = process.env.WMK_REACT_APP_PORT;

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    credentials: true,
    origin: `${reactAppHost}`,
  }));

  app.set('trust proxy', true);
} else {
  app.use(cors({
    credentials: true,
    origin: `${reactAppHost}:${reactAppPort}`,
  }));
}

app.use('/volunteerData', volunteerDataRouter);
app.use('/availability', [verifyToken, availabilityRouter]);
app.use('/inventory', [verifyToken, inventoryRouter]);
app.use('/category', [verifyToken, categoryRouter]);
app.use('/divisions', [verifyToken, divisionRouter]);
app.use('/warehouses', [verifyToken, warehouseRouter]);
app.use('/accounts', [verifyToken, accountRouter]);
app.use('/events', [verifyToken, eventRouter]);
app.use('/userEvent', [verifyToken, userEventRouter]);
app.use('/auth', authRouter);
app.use('/logs', logRouter);
app.use('/register', registerRouter);

app.listen(port, () => {
  console.log(`App listening at ${reactAppHost}:${port}`);
});
