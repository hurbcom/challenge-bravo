using CurrencyConverter.Model;

namespace CurrencyConverter.Services
{
    public interface ICurrencyCache
    {
        public bool AddCurrencyToCache(Currency currency);
        public void CleanCache();
        Currency TryGetCurrencyByNameInCache(string currencyName);
    }
}
