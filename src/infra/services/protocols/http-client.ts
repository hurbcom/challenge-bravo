import { HttpResponse } from '../../../presentation/protocols/http'

type Methods = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'OPTIONS'

export interface HTTPClient{
    call(url:string, method:Methods, body?:any, headers?:any):Promise<HttpResponse>
}
