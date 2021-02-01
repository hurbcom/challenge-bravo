const express = require('express');

const routes = express.Router();
const { container } = require('../config/di-setup');

const currencyController = container.resolve('currencyController');
const conversionController = container.resolve('conversionController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Currency:
 *       type: object
 *       required:
 *         - _id
 *         - key
 *         - name
 *         - unit
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the Currency
 *         key:
 *           type: string
 *           description: The code key from the Currency
 *         name:
 *           type: string
 *           description: The name of the currency
 *         unit:
 *           type: string
 *           description: The unit used of the currency
 *         type:
 *           type: string
 *           description: The type of the currency [FIAT or CRYPTO]
 *       example:
 *         _id: 60171ed3b148061ff7bb34d7
 *         key: usd
 *         name: US Dollar
 *         unit: $
 *         type: fiat
 *     Conversion:
 *       type: object
 *       required:
 *         - from
 *         - to
 *         - amount
 *         - value
 *         - referenceDate
 *       properties:
 *         from:
 *           type: string
 *           description: From currency key code coin
 *         to:
 *           type: string
 *           description: To currency key code coin
 *         amount:
 *           type: number
 *           description: Amount of the exchange
 *         value:
 *           type: number
 *           description: Value converted
 *         referenceDate:
 *           type: string
 *           description: Date of the conversion
 *       example:
 *         from: brl
 *         to: usd
 *         amount: 100
 *         value: 18.307527208686135
 *         referenceDate: 2021-01-30T00:31:04.122Z
 *     ConversionRate:
 *       type: object
 *       required:
 *         - _id
 *         - referenceDate
 *       properties:
 *         _id:
 *           type: string
 *           description: the auto generated id
 *         referenceDate:
 *           type: string
 *           description: Date of the conversion
 *       example:
 *         _id: brl
 *         referenceDate: usd
 *         usd: 1
 *         brl: 5.462234128281574
 *         eur: 0.8238790070674381
 *         etc: 0.000717671227436289
 *         btc: 0.000028862707719134912
 *     CurrencyKey:
 *       type: object
 *       required:
 *         - key
 *       properties:
 *         key:
 *           type: string
 *           description: The currency key
 *       example:
 *         key: brl
 */

/**
 * @swagger
 * tags:
 *   name: Currency
 *   description: Currency Conversion API
 */

routes.get('/health-status', (_, res) => res.json({ status: 'ok' }));

/**
 * @swagger
 * /api/currency:
 *   get:
 *     summary: Returns the list of all the Currencies
 *     tags: [Currency]
 *     responses:
 *       200:
 *         description: The list of the Currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Currency'
 */
routes.get('/currency', (req, res) => currencyController.listCurrencies(req, res));

/**
 * @swagger
 * /api/currency:
 *   post:
 *     summary: Creates a new Currency
 *     tags: [Currency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CurrencyKey'
 *     responses:
 *       201:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       400:
 *         description: ${key} currency is not supported
 *       500:
 *         description: Internal Server Error
 */

routes.post('/currency', (req, res) => currencyController.addCurrency(req, res));

/**
 * @swagger
 * /api/currency/{currency}:
 *   delete:
 *     summary: Remove a currency given a code
 *     tags: [Currency]
 *     parameters:
 *       - in: path
 *         name: currency
 *         schema:
 *           type: string
 *         required: true
 *         description: The currency code
 *     responses:
 *       204:
 *         description:
 *       400:
 *         description: ${key} currency is not supported
 *       500:
 *         description: Internal Server Error
 */
routes.delete('/currency/:key', (req, res) => currencyController.removeCurrency(req, res));

/**
 * @swagger
 * /api/currency/convert/latest:
 *   get:
 *     summary: The latest currencies from a lastro one like USD
 *     tags: [Currency]
 *     responses:
 *       200:
 *         description: The list of the latest Currencies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversionRate'
 */
routes.get('/currency/convert/latest', (req, res) => conversionController.latest(req, res));

/**
 * @swagger
 * /api/currency/convert:
 *   get:
 *     summary: Convert a money from a key code to another
 *     tags: [Currency]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         required: true
 *         description: The currency code from the conversion
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         required: true
 *         description: The currency code to the conversion
 *       - in: query
 *         name: amount
 *         schema:
 *           type: string
 *         required: true
 *         description: The amount of value that wants to convert
 *     responses:
 *       200:
 *         description:
 *         content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Conversion'
 *       400:
 *         description: ${unavailableKey} currency is not supported
 *       500:
 *         description: Internal Server Error
 */
routes.get('/currency/convert', (req, res) => conversionController.convert(req, res));

module.exports = routes;
