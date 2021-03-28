const express = require("express");
const app = express();

// Database related requires
const databaseConfig = require("./config/database");
const mongoose = require("mongoose");
const mongo = mongoose.connect(databaseConfig.uri, databaseConfig.options);

// Routes
const currencyRoutes = require("./routes/currencyRoutes");
const convertionRoutes = require("./routes/convertionRoutes");

mongo.then(
    () => {
        console.log("connected");
    },
    (error) => {
        console.log(error, "error");
    }
);

app.use(express.json());
app.use(currencyRoutes);
app.use(convertionRoutes);

// Error Handling
const erroHandler = require("./error/handlers/errorHandler");

app.use(erroHandler.apiErrorHandler);
app.use(erroHandler.genericErrorHandler);

module.exports = app;
