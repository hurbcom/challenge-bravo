const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDb = require('./config/db');
const populateDb = require('./config/populateDB');
const updateDbByInterval = require('./config/updateValuesIntervalTime');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger/swagger');
const app = express();

connectDb();
populateDb();

setInterval(() => {
  updateDbByInterval();
}, 1 * 60 * 1000);

const port = process.env.NODE_LOCAL_PORT || 3020;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/autentication', require('./src/routes/autenticationRoutes'));

app.use('/coins', require('./src/routes/coinsRoutes'));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
