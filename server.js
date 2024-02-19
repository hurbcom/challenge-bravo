const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});