const express = require('express');
const currencyController = require('../../app/controllers/currency.controller');
const validate = require('../../app/middlewares/validate');
const currencyValidation = require('../../app/validations/currency.validation');

const router = express.Router();

router.get('/convert/:from/:to/:amount', validate(currencyValidation.conversionCurrency), currencyController.getConversion);
router.get('/', currencyController.getAll);
router.post('/', validate(currencyValidation.createCurrency), currencyController.create);
router.delete('/:id', validate(currencyValidation.deleteCurrency), currencyController.destroy);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Currencies
 *   description: Currency management and retrieval
 */

/**
 * @swagger
 * /currencies:
 *   post:
 *     summary: Create a currency
 *     description: Allows the creation of currencies
 *     tags: [Currencies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - symbol
 *               - rate
 *             properties:
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *                 minLength: 2
 *                 maxLength: 4
 *               rate:
 *                 type: number
 *                 format: float
 *             example:
 *               name: PAC Coin
 *               symbol: PAC
 *               rate: 2.25
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Currency'
 *       "422":
 *         $ref: '#/components/responses/DuplicateCurrency'
 *   get:
 *     summary: Get all currencies
 *     description: Retrieve all currencies.
 *     tags: [Currencies]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Currency'
 */

/**
 * @swagger
 * /currencies/convert/{from}/{to}/{amount}:
 *   get:
 *     summary: Convert value between currencies
 *     description: Returns the result of the conversion.
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Currency symbol
 *       - in: path
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Currency symbol
 *       - in: path
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Amount of conversion
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResultConvert'
 */
/**
 * @swagger
 *  /currencies/{id}:
 *   delete:
 *     summary: Delete a currency
 *     description: Delete a currency.
 *     tags: [Currency]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Currency id
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
