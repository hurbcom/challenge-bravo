'use strict';


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConfig = require('./source/config/database');
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const port = process.env.PORT;
const env = process.env.ENV;

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Connected to the mongo  database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


require('./source/routes')(app);
const server = app.listen(port, () => console.log(`Server running on port: ${port} - environment ${env}
`));
server.timeout = 30000;
