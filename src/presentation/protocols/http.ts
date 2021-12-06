export interface HttpResponse{
    statusCode: number
    body: any
  }
export interface HttpRequest {
    body?: any
    headers?: any
    query?:any
    params?:any
  }
