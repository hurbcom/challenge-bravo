import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {EMPTY, Observable, shareReplay} from "rxjs";
import {Currency} from "../model/currency";
import {ConvertResponse} from "../model/convert.response";

@Injectable({providedIn: 'root'})
export class DataService {

  /** Server endpoint */
  readonly endPoint = 'http://localhost:8080/api/v1';

  private readonly currenciesCache: Observable<Currency[]>;

  private readonly convertCache = new Map<string, Observable<ConvertResponse>>();


  /**
   * Class constructor
   * @param {HttpClient} httpClient - Http client instance
   * */
  constructor(private readonly httpClient: HttpClient) {
    this.currenciesCache = this.httpClient.get<Currency[]>(`${this.endPoint}/currency`).pipe(shareReplay());
  }

  /**
   * Obtain a List of available currencies
   * @return Observable<Currency[]> - available currencies lists
   */
  getCurrencies(): Observable<Currency[]> {
    return this.currenciesCache;
  }

  convert(amount: number, from: Currency, to: Currency, verbose = false): Observable<ConvertResponse> {
    const cacheKey = `${amount}|${from.code}|${to.code}|${verbose}`;
    if (!this.convertCache.has(cacheKey)) {
      const params = new HttpParams({
        fromObject: {
          amount: amount,
          from: from.code,
          to: to.code,
          verbose: verbose
        }
      });
      this.convertCache.set(
        cacheKey, this.httpClient.get<ConvertResponse>(
          `${this.endPoint}/convert`, {params: params}).pipe(shareReplay()));
    }
    let response = this.convertCache.get(cacheKey);
    return (response === undefined || response === null) ? EMPTY : response;
  }

}
