const express = require("express");
const helmet = require("helmet");
const routes = require("./routes");
const configService = require("./services/configService");
const dbContext = require("./database/dbContext");

const app = express();
const { PORT } = process.env;

dbContext.connect();
configService.seedDatabase();

app.use(helmet());
app.use(routes);
app.listen(PORT, () => {
    console.log(`Challenge Bravo server is running on port ${PORT}`);
});
