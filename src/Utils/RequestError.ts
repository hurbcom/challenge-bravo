class RequestError extends Error {
  statusCode: number
  data: any

  constructor(message: string, data?: any, statusCode?: number) {
    super(message)

    this.name = 'Request Error'
    this.message = message || "There's a problem with your request"
    this.data = data || {}
    this.statusCode = statusCode || 500
  }

  public toObject() {
    return {
      message: this.message,
      data: this.data,
      statusCode: this.statusCode
    }
  }
}

export default RequestError
