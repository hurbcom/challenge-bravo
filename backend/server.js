'use strict';
import "babel-polyfill";
import express from 'express';
import currencyRoute from './routes/currency-route';
import cors from 'cors';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

app.use(cors())

app.get('/', (req, res) => {
  res.send("Hello");
});


app.use('/exchange-rate', currencyRoute);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

export default app;
