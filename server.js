const express = require('express');
const app = express();
require('dotenv').config()

app.use(express.static('public'));

app.get("/api*", function (request, response) {
  response.json(request.query);
});

const listener = app.listen(8080, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
