using CurrencyConverter.Domain.Entities;
using System.Collections.Generic;

namespace CurrencyConverter.Service.Interfaces
{
    public interface ICurrencySrvc
    {
        IEnumerable<Currency> GetAll();
        IEnumerable<Currency> GetAllActive();
        Currency AddCurrency(string currencyName);
        bool DeleteCurrency(string currencyName);
        bool SyncAllActiveCurrencyRates();
    }
}
