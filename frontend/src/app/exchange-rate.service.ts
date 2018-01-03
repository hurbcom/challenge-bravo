import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';


import { Http, Headers, RequestOptions, Response, URLSearchParams, ResponseContentType } from '@angular/http';

@Injectable()
export class ExchangeRateService {

  constructor(private http: Http) { }
  //http://localhost:8080/exchange-rate?from=BRL&amount=3.5&to=USD

  public getExchangeRate( from : string, to : string, amount : number) : Observable<any>{
    let options = new RequestOptions({ search: {from : from , to : to, amount : amount } });

    return this.http.get(`${environment.apiUrl}/exchange-rate`, options)
    .map((res: Response) => {
      return res.json();
    });
  }
}
