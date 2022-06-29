const currencies = require("./src/routes/currenciesRoutes");
const express = require("express");

const app = express();
currencies(app);

app.listen(3000, () => console.log("listening 3000"));

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});
