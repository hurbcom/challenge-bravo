module.exports = {
    setJSONBody: setJSONBody,
  }
  
  function setJSONBody(requestParams, context, ee, next) {
    return next(); // MUST be called for the scenario to continue
  }