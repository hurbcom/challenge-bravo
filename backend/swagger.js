const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./src/routes.js']

swaggerAutogen(outputFile, endpointsFiles)


swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./src/server')           // Your project's root file
})