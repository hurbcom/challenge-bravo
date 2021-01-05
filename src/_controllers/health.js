const makeGetHealth = () => {
  return async function getHealth(httpRequest = {}) {
    return {
      statusCode: 200,
      body: {
        success: true
      }
    }
  }
}

module.exports = makeGetHealth