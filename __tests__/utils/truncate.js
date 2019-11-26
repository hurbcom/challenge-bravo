import db from '../../src/database'

export default () => {
  return Promise.all(
    db.modelNames().map(name => {
      db.models[name].deleteMany({})
    })
  )
}
