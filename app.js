const express = require('express');
const accountsRoutes = require('./routes/accounts/accounts');
const inventoryRoutes = require('./routes/inventory/inventory');

const app = express();
const port = 3000;

app.use('/accounts', accountsRoutes);

app.use('/inventory', inventoryRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
