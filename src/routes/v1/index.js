const express = require('express');
const currencyRoute = require('./currency.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/currencies',
    route: currencyRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
