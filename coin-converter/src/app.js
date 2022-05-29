const express = require('express')
const routes = require('./routes')
const swaggerUi = require('swagger-ui-express')

const swaggerDoc = require('../swagger.json')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDoc)
  )

app.use('/api', routes.converter)

exports.app = app

/**
 * Iniciar o servidor HTTP
 * @param {Number | String} port Porta que será aberta para acessar a API
 * @param {String} env Monstra em que ambiente esta sendo executado
 * @author Fellipe Maia
 * @returns Promise com sucesso caso a inicialização ocorra corretamente
 * || Promise com falha caso não inicie corretamente o servidor
 */
module.exports.start = (port, env) => {
    return new Promise((resolve, reject) => {
        try {
            global.appServe = app.listen(port, () => {
                console.log(`Sistema iniciado port: ${port}, env: ${env}`)
                resolve(true)
            })
        } catch (error) {
            console.error(`Error ao iniciar servidor HTTP`)
            reject(error)
        }
    })
}

/**
 * Finalizar o servidor HTTP
 * @author Fellipe Maia
 * @returns Promise com sucesso caso a finalização ocorra corretamente
 * || Promise com falha caso não finalize corretamente o servidor
 */
module.exports.stop = () => {
    return new Promise((resolve, reject) => {
        if (!global.appServer) return resolve(true)
        global.appServer.close((err) => {
            err ? reject(err) : resolve(true)
        });
    });
}