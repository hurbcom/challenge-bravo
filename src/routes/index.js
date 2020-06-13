module.exports = {
    get: [
        {
            path: '/',
            callback: (req, res) => {
                res.send('API IS ONLINE')
            },
        },
        {
            path: '/coins',
            callback: require('@controllers/list-coins'),
            /**
             * @swagger
             * /coins:
             *  get:
             *    summary: Pegar lista de moedas cadastrada
             *    tags:
             *      - Coins
             *    responses:
             *      '200':
             *         description: JSON com todas as moedas cadastrada no conversor
             */
        },
        {
            path: '/coin/conversion',
            callback: require('@controllers/convert-currency'),
            /**
             * @swagger
             * /coin/conversion:
             *  get:
             *    summary: Converter valores
             *    tags:
             *      - Coin
             *    parameters:
             *      - in: query
             *        name: from
             *        required: true
             *        schema:
             *          type: string
             *      - in: query
             *        name: to
             *        required: true
             *        schema:
             *          type: string
             *      - in: query
             *        name: amount
             *        required: true
             *        schema:
             *          type: number
             *    responses:
             *      '200':
             *        description: Valor convertido
             *        content:
             *          application/json:
             *            schema:
             *              type: string
             *              properties:
             *                convertedValue:
             *                  type: string
             *                  example: 200.00
             *                from:
             *                  type: object
             *                  properties:
             *                    name:
             *                      type: string
             *                      example: USD
             *                    value:
             *                      type: string
             *                      example: 1.00
             *                    lastUpdate:
             *                      type: string
             *                      example: 2020-6-12 15:54:46
             *                to:
             *                  type: object
             *                  properties:
             *                    name:
             *                      type: string
             *                      example: BIT
             *                    value:
             *                      type: string
             *                      example: 3333
             *                    lastUpdate:
             *                      type: string
             *                      example: 2020-6-12 15:54:46
             *                message:
             *                  type: string
             *                  example: Success
             */
        },
    ],
    post: [
        {
            path: '/coin',
            callback: require('@controllers/add-coin'),

            /**
             * @swagger
             * /coin:
             *   post:
             *     tags:
             *       - Coin
             *     summary: Adicionar moeda ao banco moedas
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               name:
             *                 type: string
             *               value:
             *                 type: string
             *   responses:
             *     '200':
             *        description: Documentar
             *

             */
        },
    ],
    delete: [
        {
            path: '/coin/:id',
            callback: require('@controllers/delete-coin'),
            /**
             * @swagger
             * /coin:
             *  delete:
             *    summary: Documentar
             *    tags:
             *      - Coin
             *    responses:
             *      '200':
             *         description: Documentar
             */
        },
    ],
    put: [
        {
            path: '/coin',
            callback: require('@controllers/update-coin'),
            /**
             * @swagger
             * /coin:
             *  put:
             *    summary: Documentar
             *    tags:
             *      - Coin
             *    responses:
             *      '200':
             *         description: Documentar
             */
        },
    ],
}
