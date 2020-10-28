const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/another', (req, res) => {
  res.send('This is another route!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
