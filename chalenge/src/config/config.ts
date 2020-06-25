
module.exports = {
  "development": {
    "storage": process.env.ORM_STORAGE,
    "dialect": process.env.ORM_DIALECT
  },
  "test": {
    "storage": process.env.ORM_STORAGE,
    "dialect": process.env.ORM_DIALECT
  },
  "production": {
    "storage": process.env.ORM_STORAGE,
    "dialect": process.env.ORM_DIALECT
  }
};