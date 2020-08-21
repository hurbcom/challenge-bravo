const express = require('express')

module.exports = ({ logger, config, router }) => {
    const app = express()

    app.use(router)

    return {
        app,
        start: () => new Promise((resolve) => {
            const http = app.listen(config.port, () => {
                const { port } = http.address()
                logger.info(`Listening to port: ${port}`)
            })
        })
    }
}