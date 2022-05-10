import { HttpStatus } from '../web/http-status';

export abstract class BaseController {
  protected abstract serviceResponseMap: Map<string, HttpStatus>;

  protected getHttpStatus(serviceResponse: any) {
    const httpStatus = this.serviceResponseMap.get(serviceResponse.constructor.name);
    return httpStatus ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
