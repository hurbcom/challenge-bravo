using CurrencyConverter.Model;
using System.Collections.Generic;

namespace CurrencyConverter.Services
{
    public interface ICurrencyService
    {
        IEnumerable<Currency> GetCurrencies();
        Currency GetCurrencyById(long currencyId);
        void InsertCurrency(Currency currency);
        void DeleteCurrency(long currencyId);
    }
}
