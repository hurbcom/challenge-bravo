const express = require('express');
const router = express.Router();
const autenticationController = require("../controller/autenticationController")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * @swagger
 * /authentication/generate:
 *   post:
 *     tags: 
 *       - Authentication
 *     summary: Gerar chave de token API
 *     description: |
 *       Gera uma chave de token API para autenticação. Cada chave tem uma validade de 1 hora. 
 *       Requer um corpo JSON com a seguinte estrutura: 
 *       {
 *         "userID": "challenge",
 *         "passwordID": "bravo"
 *       }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *               passwordID:
 *                 type: string
 *           example:
 *             userID: "challenge"
 *             passwordID: "bravo"
 *     responses:
 *       200:
 *         description: Resposta bem-sucedida com a chave de token API gerada.
 *         content:
 *           application/json:
 *             example:
 *               message: Chave de token API gerada com sucesso
 *               apiKey: "sua_chave_gerada"
 *       400:
 *         description: Erro do cliente - Dados ausentes ou inválidos na solicitação.
 *         content:
 *           application/json:
 *             example:
 *               error: Dados ausentes ou inválidos na solicitação, verifique e tente novamente
 *       403:
 *         description: Erro do cliente - Credenciais inválidas.
 *         content:
 *           application/json:
 *             example:
 *               error: Credenciais inválidas
 *       500:
 *         description: Erro do servidor - Erro interno do servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Erro interno do servidor
 */


router.post('/generate', async (req, res) => {
    const { status, data } = autenticationController(req, res);
    return res.status(status).json(data);
});

module.exports = router;
