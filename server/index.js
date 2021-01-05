const { createServer } = require('../src/routes')

const app = createServer()

app.listen(3000, () => {
    console.log('Server is listening on port 3000.')
  })