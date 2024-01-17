const express = require('express');
const router = express.Router();
const coinController = require("../controller/coinsController")
const dotenv = require('dotenv');
const verifyToken = require("../utils/verifyToken")
dotenv.config();

/**
 * @swagger
 * /coins/{env}/convert:
 *   get:
 *     tags: 
 *       - Coins
 *     summary: Recupera o valor convertido da moeda
 *     description: |
 *       Retorna o valor convertido da moeda com base nos parâmetros de consulta fornecidos.
 *       Este endpoint é de acesso público.
 *     parameters:
 *       - name: env
 *         in: path
 *         description: O ambiente da aplicação (por exemplo, 'prod').
 *         required: true
 *         schema:
 *           type: string
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

router.get('/:env/convert', async (req, res) => {
    const { status, data } = await coinController.ConvertCoinAmount(req, res);
    return res.status(status).json(data);
});

/**
 * @swagger
 * /coins/{env}/insert:
 *   post:
 *     tags: 
 *       - Coins
 *     summary: Insere uma nova moeda na base de dados
 *     description: |
 *       Insere uma nova moeda na base de dados. Este endpoint requer uma chave de segurança (API Key) na URL
 *       e recebe um corpo JSON no formato especificado. A resposta incluirá uma mensagem e detalhes da moeda inserida.
 *     parameters:
 *       - name: env
 *         in: path
 *         description: O ambiente da aplicação (por exemplo, 'prod').
 *         required: true
 *         schema:
 *           type: string
 *       - name: api_key
 *         in: query
 *         description: Chave de segurança da API para autenticação.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *           example:
 *             code: "DD"
 *             name: "Dungeons&Dragons"
 *             value: 18000.59
 *     responses:
 *       200:
 *         description: Moeda salva com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               message: Coin saved success
 *               Coin:
 *                 code: "D&D"
 *                 name: "Dungeons&Dragons"
 *                 value: 18000.59
 *                 _id: "65a1a82a519f6c27dfc930d6"
 *                 createdAt: "2024-01-12T20:59:22.289Z"
 *                 updatedAt: "2024-01-12T20:59:22.289Z"
 *                 __v: 0
 *       400:
 *         description: Oops! Dados ausentes ou inválidos na solicitação, verifique e tente novamente.
 *         content:
 *           application/json:
 *             example:
 *               error: Missing or invalid data in the request, check and try again
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

router.post('/:env/insert', verifyToken, async (req, res) => {
    const { status, data } = await coinController.InsertCoin(req, res);
    return res.status(status).json(data);
});
/**
 * @swagger
 * /coins/{env}/update:
 *   put:
 *     tags: 
 *       - Coins
 *     summary: Atualiza uma moeda na base de dados
 *     description: |
 *       Atualiza uma moeda na base de dados. Este endpoint requer uma chave de segurança (API Key) na URL
 *       e recebe um corpo JSON no formato especificado. A resposta incluirá uma mensagem indicando que a atualização foi bem-sucedida.
 *     parameters:
 *       - name: env
 *         in: path
 *         description: O ambiente da aplicação (por exemplo, 'prod').
 *         required: true
 *         schema:
 *           type: string
 *       - name: api_key
 *         in: query
 *         description: Chave de segurança da API para autenticação.
 *         required: true
 *         schema:
 *           type: string
 *       - name: code
 *         in: path
 *         description: Código da moeda a ser atualizada.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *           example:
 *             code: "D&D"
 *             name: "Dungeons&Dragons"
 *             value: 18000.59
 *     responses:
 *       200:
 *         description: Moeda atualizada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               message: Coin update success
 *               Coin:
 *                 code: "D&D"
 *                 name: "Dungeons&Dragons"
 *                 value: 18000.59
 *                 _id: "65a1a82a519f6c27dfc930d6"
 *                 createdAt: "2024-01-12T20:59:22.289Z"
 *                 updatedAt: "2024-01-12T20:59:22.289Z"
 *                 __v: 0
 *       400:
 *         description: Oops! Dados ausentes ou inválidos na solicitação, verifique e tente novamente.
 *         content:
 *           application/json:
 *             example:
 *               error: Missing or invalid data in the request, check and try again
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

router.put('/:env/update', verifyToken, async (req, res) => {
    const { status, data } = await coinController.UpdateCoin(req, res);
    return res.status(status).json(data);
});

/**
 * @swagger
 * /coins/{env}/delete/{code}:
 *   delete:
 *     tags: 
 *       - Coins
 *     summary: Remove uma moeda da base de dados
 *     description: |
 *       Remove uma moeda da base de dados. Este endpoint requer uma chave de segurança (API Key) na URL
 *       e recebe o código da moeda a ser removida como parâmetro na URL. A resposta incluirá uma mensagem indicando que a remoção foi bem-sucedida.
 *     parameters:
 *       - name: env
 *         in: path
 *         description: O ambiente da aplicação (por exemplo, 'prod').
 *         required: true
 *         schema:
 *           type: string
 *       - name: api_key
 *         in: query
 *         description: Chave de segurança da API para autenticação.
 *         required: true
 *         schema:
 *           type: string
 *       - name: code
 *         in: path
 *         description: Código da moeda a ser removida.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Moeda removida com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               message: Currency Deleted
 *       201:
 *         description: Moeda não deletada.
 *         content:
 *           application/json:
 *             example:
 *               message: Currency not deleted
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

router.delete('/:env/delete/:code', verifyToken, async (req, res) => {
    const { status, data } = await coinController.DeleteCoin(req, res);
    return res.status(status).json(data);
});

module.exports = router;
