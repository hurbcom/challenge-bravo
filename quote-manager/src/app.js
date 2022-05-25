const express = require('express')
const routes = require('./routes')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes.updateQuote)
app.use('/api', routes.coin)

exports.app = app

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

module.exports.stop = () => {
    return new Promise((resolve, reject) => {
        if (!global.appServer) return resolve(true)
        global.appServer.close((err) => {
            err ? reject(err) : resolve(true)
        });
    });
}