using CurrencyQuotation.Daos.Interfaces;
using CurrencyQuotation.Models;
using CurrencyQuotation.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace CurrencyQuotation.Services
{
    public class CurrencyQuotationService : ICurrencyQuotationService
    {
        private readonly ICurrencyQuotationDao _currencyQuotationDao;

        public CurrencyQuotationService(ICurrencyQuotationDao currencyQuotationDao)
        {
            this._currencyQuotationDao = currencyQuotationDao;
        }

        public decimal GetQuotation(string from, string to, decimal amount)
        {
            IList<string> currenciesName = new List<string>() { from, to };
            IList<Currency> currencies = this._currencyQuotationDao.GetQuotationByCurrencies(currenciesName);

            Currency fromCurrency = currencies.First(c => from.Equals(c.Name));
            Currency toCurrency = currencies.First(c => from.Equals(c.Name));

            decimal result = (fromCurrency.DolarAmount * amount) / toCurrency.DolarAmount;
            return result;
        }
    }
}
