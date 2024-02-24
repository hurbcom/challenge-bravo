require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger/swagger.json');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ message: err.message, body: err.body });
    }
    next();
});

const limiter = rateLimit({
    windowMs: 1000,
    limit: 10000,
    standardHeaders: true,
    message: 'You have exceeded your ~1000 requests per second limit.',
});
app.use(limiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer: true}));

const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});