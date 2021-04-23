using CurrencyConverter.Model;
using System.Collections.Generic;

namespace CurrencyConverter.Repository
{
    public interface ICurrencyRepository
    {
        IEnumerable<Currency> GetCurrencies();
        Currency GetCurrencyById(long currencyId);
        Currency GetCurrencyByName(string currencyName);
        void InsertCurrency(string currencyName, decimal currencyValue);
        void DeleteCurrency(string currencyName);
        void Save();
    }
}
