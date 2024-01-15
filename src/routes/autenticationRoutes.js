const express = require('express');
const router = express.Router();
const autenticationController = require("../controller/autenticationController")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * @swagger
 * /coins/convert:
 *   get:
 *     tags: 
 *       - Coins
 *     summary: Recupera o valor convertido da moeda
 *     description: |
 *       Retorna o valor convertido da moeda com base nos parâmetros de consulta fornecidos.
 *       Este endpoint é de acesso público.
 *     parameters:
 *       - name: from
 *         in: query
 *         description: O código da moeda (por exemplo, BRL) para converter.
 *         required: true
 *         schema:
 *           type: string
 *       - name: to
 *         in: query
 *         description: O código da moeda (por exemplo, USD) para converter.
 *         required: true
 *         schema:
 *           type: string
 *       - name: amount
 *         in: query
 *         description: O valor a ser convertido.
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Resposta bem-sucedida com o valor da moeda convertida.
 *         content:
 *           application/json:
 *             example:
 *               message: Conversão de moeda bem-sucedida
 *               valorConvertido: 101.25
 *       400:
 *         description: Oops! Dados ausentes na pesquisa, verifique e tente novamente.
 *         content:
 *           application/json:
 *             example:
 *               error: Missing data in the search, check and try again
 *       403:
 *         description: Este valor não é permitido.
 *         content:
 *           application/json:
 *             example:
 *               error: This amount is not allowed
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

router.post('/generate', async (req, res) => {
    const { status, data } = autenticationController(req, res);
    return res.status(status).json(data);
});

module.exports = router;
