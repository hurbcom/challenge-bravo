const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDb = require('./config/db');

const app = express();

connectDb();
const port = process.env.NODE_LOCAL_PORT || 3020;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', require('./routes/getCoinsConvert'));

app.use('/', require('./routes/addCoins'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});