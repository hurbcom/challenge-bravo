using CurrencyQuotation.Models;
using CurrencyQuotation.Models.Dtos;
using System.Collections.Generic;

namespace CurrencyQuotation.Services.Interfaces
{
    public interface ICurrencyQuotationService
    {
        decimal GetQuotation(string from, string to, decimal amount);
        bool InsertNewCurrency(CurrencyDto currencyDto);
        bool DeleteCurrencyByName(string name);
        void SaveAll(IEnumerable<Currency> currencies);
    }
}
