const express = require("express");
const app = express();
const routers = require("./routes");

app.use(express.json());


app.use("/api", routers)


module.exports = app;