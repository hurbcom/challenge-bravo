import { init } from 'Utils/Server'

init().then((app) => {
  const port = process.env.PORT || 3000

  app.listen(port, () => {
    console.log('\n+=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+')
    console.log(`| Server started at: http://localhost:${port} |`)
    console.log('+=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+\n')
  })
})
