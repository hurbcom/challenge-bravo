import app from './app'
import config from './config'

app.listen(config.app.port, error => {
  if (error) {
    console.log(`> Error: ${error.message}`)
    process.exit(1)
  }

  console.log(`> Running at ${config.app.port} port`)
})
