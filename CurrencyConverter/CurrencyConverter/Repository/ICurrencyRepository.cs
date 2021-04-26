using CurrencyConverter.Model;
using System.Collections.Generic;

namespace CurrencyConverter.Repository
{
    public interface ICurrencyRepository
    {
        IEnumerable<Currency> GetCurrencies();
        Currency GetCurrencyById(long currencyId);
        Currency GetCurrencyByName(string currencyName);
        void InsertCurrency(Currency currency);
        void DeleteCurrency(string currencyName);
        void Save();
        void InsertCurrenciesList(IList<Currency> currenciesList);
        void UpdateCurrenciesList(IList<Currency> currenciesList);
    }
}
