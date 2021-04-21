using CurrencyConverter.Model;
using System.Collections.Generic;

namespace CurrencyConverter.Repository
{
    interface ICurrencyRepository
    {
        IEnumerable<Currency> GetCurrencies();
        Currency GetCurrencyById(long currencyId);
        void InsertCurrency(Currency currency);
        void DeleteCurrency(long currencyId);
        void Save();
    }
}
