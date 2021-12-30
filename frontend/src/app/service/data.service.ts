import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {EMPTY, Observable, shareReplay,} from "rxjs";
import {Currency} from "../model/currency";
import {ConvertResponse} from "../model/convert.response";

@Injectable({providedIn: 'root'})
export class DataService {

  /** Server endpoint */
  readonly endPoint = 'http://localhost:8080/api/v1';

  /**
   *  Currencies list cache
   *  TODO implement a timeout logic
   * */
  private currenciesCache?: Observable<Currency[]>;

  /**
   * Currency exchanges cache
   * TODO implement a timeout logic
   * */
  private readonly convertCache = new Map<string, Observable<ConvertResponse>>();

  /**
   * Class constructor
   * @param {HttpClient} httpClient - Http client instance
   * */
  constructor(private readonly httpClient: HttpClient) {
  }

  /**
   * Creates a new custom currency
   * @param {Currency} currency - Currency to be created
   * @return Observable<any> - creation response
   */
  newCurrency(currency: Currency): Observable<any> {
    return this.httpClient.post(`${this.endPoint}/currency`, JSON.stringify(currency));
  }

  /**
   * Obtain a List of available currencies
   * @return Observable<Currency[]> - available currencies lists
   */
  getCurrencies(): Observable<Currency[]> {
    if (this.currenciesCache === undefined || this.currenciesCache === null) {
      this.currenciesCache = this.httpClient.get<Currency[]>(`${this.endPoint}/currency`).pipe(shareReplay());
    }
    return (this.currenciesCache === undefined || this.currenciesCache === null) ? EMPTY : this.currenciesCache;
  }

  /**
   * Clear currency list cache
   */
  clearCurrenciesCache(): void {
    this.currenciesCache = undefined;
  }

  /**
   * Saves an existing custom currency
   * @param {Currency} currency - Currency to be created
   * @return Observable<any> - Saves response
   */
  saveCurrency(currency: Currency): Observable<any> {
    return this.httpClient.put(`${this.endPoint}/currency/${currency.code}`, JSON.stringify(currency));
  }

  /**
   * Deletes a currency
   * @param {Currency} currency - Currency to be deleted
   * @return Observable<any> - deletion response
   */
  deleteCurrency(currency: Currency): Observable<any> {
    return this.httpClient.delete(`${this.endPoint}/currency/${currency.code}`);
  }

  /**
   * Convert an amount from currency to another using bravo-server webservice, and cache the result.
   * @param {number} amount - Amount te be converted
   * @param {Currency} from - Origin currency
   * @param {Currency} to - Destination currency
   * @param {boolean} verbose - Obtain a verbose answer from the server for debugging
   * @return Observable<ConvertResponse> - Exchange conversion response
   */
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

  /**
   * Clear currency exchange conversion cache
   */
  clearConversionCache(): void {
    this.convertCache.clear();
  }

}
