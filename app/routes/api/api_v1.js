const express = require('express');

const routes = express.Router();

routes.get('/', (_req, res) => {
  res.status(200).send('Welcome to the Challenge Bravo');
});

module.exports = routes;
