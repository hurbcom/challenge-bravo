var express = require('express');
var app = express();

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.json({});
});

var listener = app.listen(8080, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
