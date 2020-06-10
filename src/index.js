const express = require('express');
var bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json())

app.listen(3333)


