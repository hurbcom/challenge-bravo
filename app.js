const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongodb = require("./config/database");
const app = express();
const port = process.env.port || 5000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, PATCH, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, function() {
    console.log(
        "Servidor ativado na porta: %d e no modo: %s",
        this.address().port,
        app.settings.env
    );
});

//IMPORTA ROTAS
require("./routes/Rotas")(app);