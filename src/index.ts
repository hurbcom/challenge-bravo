import { Server } from 'Utils'

const server = new Server()
server.init().then((app) => {
  const port = process.env.PORT || 3000

  app.listen(port, () => {
    console.log('\n+=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+')
    console.log(`| Server started at: http://localhost:${port} |`)
    console.log('+=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+\n')
  })
})
