import path from 'path'
import fs from 'fs'

fs.readdir(path.resolve(__dirname), (error, data) => {
  if (error) {
    console.log(`> Error: ${error.message}`)
    process.exit(1)
  }

  const seeders = data.filter(seed => /\b(\w*seed\w*)\b/g.test(seed))

  seeders.map(async seedName => {
    const seed = require(path.resolve(__dirname, seedName))
    try {
      const Model = require(path.resolve(__dirname, '..', '..', 'models', seed.default.model))

      console.log(await Model.default.create(seed.default.data))

      console.log('> Finish...')
      process.exit(0)
    } catch (error) {
      console.log(`> Error: ${error.message}`)
      process.exit(1)
    }
  })
})
