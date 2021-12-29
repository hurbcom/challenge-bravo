import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, shareReplay} from "rxjs";
import {Currency} from "../model/currency";

@Injectable({providedIn: 'root'})
export class DataService {

  /** Server endpoint */
  readonly endPoint = 'http://localhost:8080/api/v1';

  private readonly currencies: Observable<Currency[]>;

  /**
   * Class constructor
   * @param {HttpClient} httpClient - Http client instance
   * */
  constructor(private readonly httpClient: HttpClient) {
    this.currencies = this.httpClient.get<Currency[]>(`${this.endPoint}/currency`).pipe(shareReplay());
  }

  /**
   * Obtain a List of available currencies
   * @return Observable<Currency[]> - available currencies lists
   */
  getCurrencies(): Observable<Currency[]> {
    return this.currencies;
  }

}
