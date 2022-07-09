import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Cotacao } from '../model-view/Cotacao';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotacaoService {

  url = environment.apiUrl + '/cotacao'

  constructor(private http: HttpClient) { }

  getCotacao(cotacao: Cotacao) {

    console.log(this.url + "?from=" + cotacao.from + "&to=" + cotacao.to + "&amount=" + cotacao.amount);

    return this.http.get<any>(this.url + "?from=" + cotacao.from + "&to=" + cotacao.to + "&amount=" + cotacao.amount
      , {
        headers: environment.apiHeaders
      });
  }
}
