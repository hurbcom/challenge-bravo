const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");

const { CurrencyRouter } = require("./routes/currency.routes");
const { ConvertRouter } = require("./routes/convert.routes");

var mongoIP = process.env["MONGO_IP"] || "127.0.0.1";
var mongoURI = `mongodb://${mongoIP}/challenge-bravo`;

const app = express();

app.use(bodyParser.json());

app.use("/currency", CurrencyRouter);
app.use("/convert", ConvertRouter);

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on("error", (err) => {
    console.log(err);
});

db.once("open", () => {
    console.log("Connected to mongoose!");
    app.listen(3000, () => {
        console.log("Server start!");
    });
});
