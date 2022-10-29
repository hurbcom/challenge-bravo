const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var bodyParser = require('body-parser')

// App
const app = express();

// parse application/json
app.use(bodyParser.json())

// Database
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
	useNewUrlParser: true
});

const db = mongoose.connection;

db.on('connected', () => {
	console.log('DB is open');
});

db.on('error', err => {
	console.log(`DB connection has occured \n${err}`);
});

db.on('disconnected', () => {
	console.log('DB connection is disconnected');
});

process.on('SIGINT', () => {
	db.close(() => {
			console.log(
			'DB connection is disconnected due to application termination'
			);
			process.exit(0);
	});
});

// Load models
const Currency = require('./models/currency');

// Load routes
const indexRoutes = require('./routes/index-routes');
app.use('/', indexRoutes);

const currencyRoutes = require('./routes/currency-routes');
app.use('/currency', currencyRoutes);

const convertRoutes = require('./routes/convert-routes');
app.use('/convert', convertRoutes);





module.exports = app;