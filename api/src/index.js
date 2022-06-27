const setup = require('./setup')
const app = require('./app')

if (process.env.SETUP) {
  console.log('setup in progress...')
  setup().then(() => {
    console.log('setup is done ✅')
    app.start()
  })
} else {
  app.start()
}
