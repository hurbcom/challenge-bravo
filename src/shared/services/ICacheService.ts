interface ICacheService {
  saveAllCurrenciesNames(names: { name: string }[]): Promise<void>;
  getCurrencyNameByCode(currencyCode: string): Promise<string>;
}

export { ICacheService };
