const express = require('express');
const app = express();

const accessProtectionMiddleware = async (req, res, next) => {
	next();
};

require('./src/routes/main')(app, accessProtectionMiddleware);

app.listen(3000);