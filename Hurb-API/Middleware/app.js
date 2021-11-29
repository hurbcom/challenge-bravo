const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('../src/router');

class App {
  constructor() {
    this.app = express();
    this.app.use(cors());
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(morgan('dev'));
    this.app.use((req, res, next) => {
      res.header("Access-Controll-Allow-Origin", "*");
      res.header("Access-Controll-Allow-Methods", "Get, POST, PUT,OPTIONS, DELETE");
      res.header("Access-Controll-Allow-Headers","*");// "Access, Content-type, Authorization, Acept, Origin, X-Requested-With")
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Content-Type', 'application/json');
      res.header('Accept', 'application/json');
      next();
    })
  }

  routes() {
    this.app.use(routes);
  }
}

module.exports = new App().app;