import { Router } from 'express'

import CurrencyController from './controllers/CurrencyController'

const routes = Router()

/**
 * @swagger
 *
 * definitions:
 *   CreateResponse:
 *     type: Object
 *     properties:
 *       currency:
 *         type: string
 */

/**
 * @swagger
 *
 * /currencies:
 *   get:
 *     description: Convert currencies
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: from
 *         description: From currency.
 *         in: query
 *         required: true
 *         type: string
 *       - name: to
 *         description: To currency.
 *         in: query
 *         required: true
 *         type: string
 *       - name: amount
 *         description: Amount value
 *         in: query
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: result
 */
routes.get('/currencies', CurrencyController.convert)

/**
 * @swagger
 *
 * /currencies/cached:
 *   get:
 *     description: Convert currencies
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: from
 *         description: From currency.
 *         in: query
 *         required: true
 *         type: string
 *       - name: to
 *         description: To currency.
 *         in: query
 *         required: true
 *         type: string
 *       - name: amount
 *         description: Amount value
 *         in: query
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: result
 */
routes.get('/currencies/cached', CurrencyController.convertCached)

/**
 * @swagger
 *
 * /currencies:
 *   post:
 *     description: Register currency
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: currency
 *         description: Currency.
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             currency:
 *               type: string
 *     responses:
 *       201:
 *         description: Currency document
 */
routes.post('/currencies', CurrencyController.add)

/**
 * @swagger
 *
 * /currencies/{id}:
 *   delete:
 *     description: Delete one currency
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Mongo ObejctID
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: No content
 */
routes.delete('/currencies/:id', CurrencyController.remove)

export default routes
