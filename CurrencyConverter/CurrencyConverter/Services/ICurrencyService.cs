using CurrencyConverter.Model;
using CurrencyConverter.Model.Dto;
using System.Collections.Generic;

namespace CurrencyConverter.Services
{
    public interface ICurrencyService
    {
        IEnumerable<Currency> GetCurrencies();
        Currency GetCurrencyById(long currencyId);
        void InsertCurrency(Currency currency);
        void DeleteCurrency(string currencyName);
        decimal ConvertAmountToCurrency(CurrencyToConvertDto currencyToConvertDto);
        Currency GetCurrencyByName(string currencyName);
    }
}
