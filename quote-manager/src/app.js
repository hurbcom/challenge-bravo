const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


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
        return global.appServer.close((err) => {
            err ? reject(err) : resolve(true)
        });
    });
}