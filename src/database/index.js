import mongoose from 'mongoose'

import config from '../config'

mongoose.connect(config.db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, error => {
  if (error) {
    console.log(`> Database error: ${error.message}`)
    process.exit(1)
  }

  console.log('> Connected to database')
})

export default mongoose
