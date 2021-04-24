using CurrencyConverter.Model;
using CurrencyConverter.Model.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CurrencyConverter.Services
{
    public interface ICurrencyService
    {
        IEnumerable<Currency> GetCurrencies();
        Currency GetCurrencyById(long currencyId);
        Task<string> InsertCurrency(string currencyName);
        void DeleteCurrency(string currencyName);
        decimal ConvertAmountToCurrency(CurrencyToConvertDto currencyToConvertDto);
        Currency GetCurrencyByName(string currencyName);
        void InsertCurrenciesList(IList<string> currenciesNames);
    }
}
