const express = require("express");
const app = express();
const routers = require("./routes");
const { sequelize } = require('../models');

app.use(express.json());


app.use("/api", routers)

// Return error message for all invalid routes
app.get('*', (req, res) => {
    res.status(400).json({ error: "Endpoint invalid" });
});

module.exports = app;