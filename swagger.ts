import swaggerAutogen from "swagger-autogen";

const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js', './src/controllers/currency-controller.js'];

const doc = {
    info: {
        version: "1.0.0",
        title: "HURB Code Challenge",
        description: "Documentação da api do desafio de código do HURB."
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "CurrencyController",
            "description": "Controller para a api de converção"
        }
    ],
    definitions: {
        CurrencyConvertion: {
            $from: "BRL",
            $to: "USD",
            $amount: 100
        },
        SaveNewCurrency: {
            $currency: "HURB",
            isFictional: true,
            currencyBackingUnitValue: 0.16
        },
        DeleteCurrency: {
            $currency: "HURB"
        },
        SuccessCurrencyConversion: {
            "quotation": {
                "from": "BRL",
                "to": "USD",
                "originalAmount": "100.00",
                "convertedAmount": "19.5800"
            }
        },
        SuccessNewCurrency: {
            "message": "Nova moeda salva com sucesso."
        },
        ErrorNewCurrency: {
            "statusCode": 500,
            "errorType": "ErroInexperado",
            "message": "Moeda: HURB Já está cadastrada."
        },
        SuccessDeleteCurrency: {
            "message": "Moeda Deletada com sucesso."
        },
        ErrorDeleteCurrency: {
            "statusCode": 500,
            "errorType": "ErroInexperado",
            "message": "A moeda: HURB que você está tentando deletar, não existe."
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc);