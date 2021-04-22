using CurrencyConverter.Model;
using System.Collections.Generic;

namespace CurrencyConverter.Repository
{
    public interface ICurrencyRepository
    {
        IEnumerable<Currency> GetCurrencies();
        Currency GetCurrencyById(long currencyId);
        void InsertCurrency(Currency currency);
        void DeleteCurrency(string currencyName);
        void Save();
    }
}
