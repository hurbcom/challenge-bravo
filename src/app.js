let express = require("express");

app = express(),
	port = 3000;
app.listen(port);
app.get('/', function (req, res) {res.json({status:"alive"})});

