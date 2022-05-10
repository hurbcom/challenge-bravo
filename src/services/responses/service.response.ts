export class ServiceResponse<T = void> {
  protected readonly data: T;
  protected readonly error: any;
  protected readonly message: string;

  constructor(data: T, error: any, message: string) {
    this.data = data;
    this.error = error;
    this.message = message;
  }
}
