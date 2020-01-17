const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

var myLogger = function (req, res, next){
    console.log(req.body);
    next();
}
app.use(myLogger);


app.get('/', function(req, res){
    res.json({
      title: 'teste',
      msg: 'msg'
    });
});

app.listen(3000);
