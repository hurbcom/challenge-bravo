const express = require('express');
const app = express();

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const accessProtectionMiddleware = async (req, res, next) => {
	next();
};

require('./src/routes/main')(app, accessProtectionMiddleware);

app.listen(3000);