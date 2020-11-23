import Status from 'http-status';

export default class HttpError extends Error {
    constructor(message) {
      super();
      this.message = message;
    }
  
    getCode() {
      if (this instanceof BadRequest) {
        return Status.BAD_REQUEST;
      } if (this instanceof NotFound) {
        return Status.NOT_FOUND;
      }
      return 500;
    }
  }
  
  export class BadRequest extends HttpError { }
  export class NotFound extends HttpError { }