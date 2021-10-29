'use strict'

const app = require('./app')

const server = app.listen(process.env.PORT || 3000, () => {
    const {address, port} = server.address()
    let host = address == '::' ? 'http://localhost' : address

    console.log('\x1b[36m%s\x1b[0m', `Api listening at ${host}:${port}`)
})
