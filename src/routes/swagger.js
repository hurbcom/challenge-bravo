module.exports = (app, accessProtectionMiddleware) => {

    const express = require('express');
    const router = express.Router();

    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('../../swagger.json');

    router.use('/', swaggerUi.serve);
    router.get('/', swaggerUi.setup(swaggerDocument));

    app.use('/api-docs', router);
};