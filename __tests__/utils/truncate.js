import db from '../../src/database'

export default () => {
  return Promise.all(
    db.modelNames().map(async name => {
      await db.models[name].deleteMany({})
    })
  )
}
