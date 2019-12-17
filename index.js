var express = require('express');
var server = express();

server.get('/', (req, res, next) => {
    res.send('Hello, World!');
})

server.listen(8080);