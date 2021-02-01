module.exports = {
    mongodbMemoryServerOptions: {
      instance: {
        dbName: 'currency_app'
      },
      binary: {
        version: '4.0.2', // Version of MongoDB
        skipMD5: true
      },
      autoStart: false
    }
  };