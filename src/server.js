import { Connection } from './database/connection/connection.js'
import { setupInit } from './utils/setupInit.js'
import { App } from './app.js'

const server = new App().server
await Connection.connect()
console.log('successfully connecting')

await setupInit()
setInterval(async () => {
  await setupInit(false)
}, 3 * 1000 * 60 * 60)

server.listen(3000, () => {
  console.log('server running at port 3000')
})
