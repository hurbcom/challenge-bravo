export class AppError extends Error {

  statusCode

  constructor(statusCode: number, message: string) {
      super()
      this.statusCode = statusCode
      this.message = message
  }
}