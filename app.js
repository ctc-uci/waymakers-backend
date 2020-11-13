const express = require('express');
const accounts = require('./routes/accounts/accounts');

const app = express();
const port = 3000;

app.use('/accounts', accounts);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
