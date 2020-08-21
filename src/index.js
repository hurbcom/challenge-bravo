const container = require('api/container')
const app = container.resolve('app')

app.start()
    .catch((error) => {
        app.logger.error(error.stack)
        process.exit()
    })