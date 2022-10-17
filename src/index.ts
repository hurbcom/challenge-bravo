import { ExpressServer } from './server'

const server = new ExpressServer().express

server.listen(server.get('port'), () => {
  console.log(`Sever online at PORT = ${server.get('port')}`)
}) 