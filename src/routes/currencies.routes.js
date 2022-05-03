const { Router } = require('express');
const currenciesController = require('../controllers/currencies.controllers');

const router = Router();

router.post(
    '/',
    /**
     * #swagger.tags = ['Currencies']
     * #swagger.summary = 'Register currency.'
     * #swagger.description = 'You can register a currency.
        <br>If currency is fictitious, `rate` is required.'
     * #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add a currency',
            required: 'true',
            schema: { $ref: '#/definitions/Currencies' }
        }
     * #swagger.responses[201] = {
            description: 'Successfully registered currency.',
            schema: { 'message': 'Successfully registered currency!' }
        }
     * #swagger.responses[400] = {
            description: 'Payload validation failed.',
            schema: { 'message': 'Currencies validation failed.' }
        }
     * #swagger.responses[409] = {
            description: 'Duplicated currency code.',
            schema: { 'message': 'Failed to register currency: Duplicate code.' }
        }
     * #swagger.responses[500] = {
            description: 'Internal Server Error',
            schema: { message: 'Failed to register currency.' }
        }
     */
    currenciesController.createCurrency,
);

router.get(
    '/',
    /**
     * #swagger.tags = ['Currencies']
     * #swagger.summary = 'List all currencies.'
     * #swagger.description = 'You can list all registered currencies.'
     * #swagger.responses[200] = {
            description: 'Successfully obtained all currencies.',
            schema: [{ $ref: '#/definitions/Currencies' }]
        }
     * #swagger.responses[500] = {
            description: 'Internal Server Error',
            schema: { message: 'Failed to list currencies.' }
        }
     */
    currenciesController.listCurrencies,
);

router.get(
    '/:code',
    /**
     * #swagger.tags = ['Currencies']
     * #swagger.summary = 'Retrieve a currency.'
     * #swagger.description = 'You can retrieve a registered currency by its code.'
     * #swagger.responses[200] = {
            description: 'Successfully obtained currency.',
            schema: { $ref: '#/definitions/Currencies' }
        }
     * #swagger.responses[404] = {
            description: 'Currency not found.',
            schema: { message: 'No currency found for code \'TEST\'.' }
        }
     * #swagger.responses[500] = {
            description: 'Internal Server Error',
            schema: { message: 'Failed to retrieve currency.' }
        }
     */
    currenciesController.retrieveCurrency,
);

router.delete(
    '/:code',
    /**
     * #swagger.tags = ['Currencies']
     * #swagger.summary = 'Delete a currency.'
     * #swagger.description = 'You can delete a registered currency by its code.'
     * #swagger.responses[200] = {
            description: 'Successfully deleted currency.',
            schema: { message: 'Successfully deleted currency!' }
        }
     * #swagger.responses[404] = {
            description: 'Currency not found.',
            schema: { message: 'No currency found for code \'TEST\'.' }
        }
     * #swagger.responses[500] = {
            description: 'Internal Server Error',
            schema: { message: 'Failed to delete currency.' }
        }
     */
    currenciesController.deleteCurrency,
);

module.exports = router;
