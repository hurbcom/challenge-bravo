using CurrencyConverter.Domain.Entities;
using System.Collections.Generic;

namespace CurrencyConverter.Service.Interfaces
{
    public interface ICurrencySrvc
    {
        Currency GetById(int id);
        IEnumerable<Currency> GetAll();
        IEnumerable<Currency> GetAllActive();
        int AddCurrency(string currency);
        bool DeleteCurrency(int currencyId);
        bool SyncAllActiveCurrencyRates();
    }
}
