const express = require('express');
const bodyParser = require('body-parser');
// const db = require("./postgres/config.js");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/another', (req, res) => {
  res.send('This is another route!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
