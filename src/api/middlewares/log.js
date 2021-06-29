export default (req, res, next) => {
    const requestStart = Date.now();
    let requestErrorMessage = null;
  
    const _getError = error => {
        errorMessage = error.message;
    };
  
    const _logClose = () => {
        _removeHandlers();
        log(req, res, "Client aborted.");
    };
  
    const _logError = error => {
        _removeHandlers();
        log(req, res, error.message);
    };
  
    const _logFinish = () => {
        _removeHandlers();
        log(req, res, requestErrorMessage);
    };
  
    const _removeHandlers = () => {
        req.off("error", _getError);
        res.off("close", _logClose);
        res.off("error", _logError);
        res.off("finish", _logFinish);
    };
  
    const log = (req, res, errorMessage) => {
      const { rawHeaders, httpVersion, method, socket, url, body } = req;
      const { remoteAddress, remoteFamily } = socket;
      const { statusCode, statusMessage } = res;
      const headers = res.getHeaders();
  
      console.log({
        timestamp: Date.now(),
        processingTime: `${(Date.now() - requestStart) / 1000}s`,
        body,
        errorMessage,
        rawHeaders,
        httpVersion,
        method,
        remoteAddress,
        remoteFamily,
        url,
        response: {
          statusCode,
          statusMessage,
          headers
        }
      });
    };
  
    req.on("error", _getError);
    res.on("close", _logClose);
    res.on("error", _logError);
    res.on("finish", _logFinish);
    
    next();
  }