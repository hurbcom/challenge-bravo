const ErrorMessages = require('../../errors/errorMessages');

class ErrorHandler {
  static handle(fn) {
    return (req, res) => {
      Promise.resolve(fn(req, res)).catch(err => {
          console.error(err);
          if(err.code === 11000 && err.keyPattern.currency === 1) {
              err.message = ErrorMessages.currency_exists;
              err.code = 409
          } else if (err.message === "currency_not_available") {
              err.message = ErrorMessages.currency_not_available;
              err.code = 400
          } else {
              err.message = ErrorMessages.default;
              err.code = 500;
          }
          res.status(err.code).json({ result: false, message: err.message });
      })
    };
  }
}

module.exports = ErrorHandler;