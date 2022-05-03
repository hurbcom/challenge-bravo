const swaggerAutogen = require('swagger-autogen');

const outputFile = './swagger/swagger_output.json';
const endpointsFiles = ['./src/app.js'];

const doc = {
    info: {
        version: '1.0.0',
        title: 'Bravo Challenge',
        description: 'Documentation automatically generated by the <b>swagger-autogen</b> module.',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Exchanges',
            description: 'API to calculate exchanges',
        },
        {
            name: 'Currencies',
            description: 'API to manage currencies',
        },
    ],
    definitions: {
        Exchanges: {
            from: {
                code: 'USD',
                amount: '15.00',
            },
            to: {
                code: 'BRL',
                amount: '76.29',
            },
        },
        Currencies: {
            $code: 'TEST',
            rate: 1.5,
        },
    },
};

swaggerAutogen()(outputFile, endpointsFiles, doc);
