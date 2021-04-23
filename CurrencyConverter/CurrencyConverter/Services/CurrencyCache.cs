using CurrencyConverter.Model;
using System.Collections.Generic;

namespace CurrencyConverter.Services
{
    public class CurrencyCache : ICurrencyCache
    {
        private readonly IDictionary<string, Currency> CurrenciesByNameCache;

        public CurrencyCache()
        {
            this.CurrenciesByNameCache = new Dictionary<string, Currency>();
        }

        public bool AddCurrencyToCache(Currency currency)
        {
            string currencyName = currency.Name;

            return this.CurrenciesByNameCache.TryAdd(currencyName, currency);
        }

        public void CleanCache()
        {
            this.CurrenciesByNameCache.Clear();
        }

        public Currency TryGetCurrencyByNameInCache(string currencyName)
        {
            this.CurrenciesByNameCache.TryGetValue(currencyName, out Currency currency);

            return currency;
        }
    }
}
