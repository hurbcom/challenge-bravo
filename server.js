const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.json({ msg: "Hello World" });
});

app.listen(3000);