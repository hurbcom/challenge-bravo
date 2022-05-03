const { Router } = require('express');
const exchangesController = require('../controllers/exchanges.controllers');
const exchangesMiddleware = require('../middlewares/exchanges.middlewares');

const router = Router();

router.get(
    '/',
    /**
     * #swagger.tags = ['Exchanges']
     * #swagger.summary = 'Get currency exchange.'
     * #swagger.description = 'You can exchange an amount between registered currencies.'
     * #swagger.parameters['from'] = { required: true }
     * #swagger.parameters['to'] = { required: true }
     * #swagger.parameters['amount'] = { required: true, type: 'string' }
     * #swagger.responses[200] = {
            description: 'Exchange successfully calculated.',
            schema: { $ref: '#/definitions/Exchanges' }
        }
     * #swagger.responses[400] = {
            description: 'Query parameter validation failed.',
            schema: { 'message': 'Query parameters validation failed.' }
        }
     * #swagger.responses[404] = {
            description: 'Currency not found.',
            schema: { 'message': 'No currency found for code \'FAKE\'.' }
        }
     * #swagger.responses[500] = {
            description: 'Internal Server Error',
            schema: { message: 'Failed to calculate exchange.' }
        }
     */
    exchangesMiddleware.validateQuery,
    exchangesController.convert,
);

module.exports = router;
