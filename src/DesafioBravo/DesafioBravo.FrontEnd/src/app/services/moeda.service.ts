import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Moeda } from '../model-view/Moeda';
import { MoedasDTO } from '../model-view/MoedasDTO';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoedaService {

  url = environment.apiUrl + '/moedas'

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<MoedasDTO>(this.url
      , {
        headers: environment.apiHeaders
      });
  }

  add(moeda: Moeda) {
    return this.http.post(this.url, moeda
      , {
        headers: environment.apiHeaders
      });
  }

  getMoeda(id: string) {
    return this.http.get<any>(this.url + "/" + id
      , {
        headers: environment.apiHeaders
      });
  }

  delete(id: string) {
    return this.http.delete<any>(this.url + "/" + id
      , {
        headers: environment.apiHeaders
      });
  }
}
