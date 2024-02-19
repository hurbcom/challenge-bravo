const express = require('express');
const helmet = require('helmet');

const app = express();
const port = 3000;

app.use(express.json());
app.use(helmet());

const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});