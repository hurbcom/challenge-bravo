// swagger.js

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Challenge Bravo - Conversão de Moedas',
      version: '1.0.0',
      description: 'API para conversão de valores entre moedas fiduciárias, criptomoedas e ficticias',
    },
  },
  apis: ['./routes/coinsRoutes.js'], // Caminho para seus arquivos de rotas
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
