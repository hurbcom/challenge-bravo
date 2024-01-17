const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDb = require('./config/mongo/db');
const populateDb = require('./config/mongo/populateDB');
const updateDbByInterval = require('./config/mongo/updateValuesIntervalTime');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const app = express();
const cors = require("cors");

const exec = require('child_process').exec;
exec('ulimit -n 65536');

connectDb();
populateDb();

setInterval(() => {
  updateDbByInterval();
}, 5 * 60 * 1000);

app.use(cors());

app.use(express.json({ timeout: 5000 }));

app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/authentication', require('./src/routes/authenticationRoutes'));

app.use('/coins', require('./src/routes/coinsRoutes'));

module.exports = app;  
