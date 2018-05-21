var express = require('express');
var app = express();

app.use(express.static('public'));

app.get("/api*", function (request, response) {
  response.json(request.query);
});

var listener = app.listen(8080, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
