const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 1000,
    limit: 10000,
    standardHeaders: true,
    message: 'You have exceeded your ~1000 requests per second limit.',
});
app.use(limiter);

const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});