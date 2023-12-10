const express = require('express');
const {winstonLogger} = require('./middlewares/logger');
const shoppingListRoutes = require('./routes/shoppingListRoutes');

require('./db');

const app = express();

app.use(express.json()); // Middleware for JSON request parsing
app.use(winstonLogger); // Logging middleware

// Use the shopping list routes
app.use('/shopping-list', shoppingListRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
