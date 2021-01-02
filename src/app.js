const express = require('express');
const helmet = require('helmet');

const app = express();

const routes = require('./routes');

const {
    PORT
} = process.env;

app.use(helmet());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Challenge Bravo server is running on port ${PORT}`);
});
