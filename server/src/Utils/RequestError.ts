export class RequestError extends Error {
  statusCode: number
  data: any

  constructor(message: string, data?: any, statusCode?: number) {
    super(message)

    this.name = 'Request Error'
    this.message = message || "There's a problem with your request"
    this.data = data || {}
    this.statusCode = statusCode || 500
  }
}
