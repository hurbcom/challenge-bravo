using CurrencyQuotation.Models;
using System.Collections.Generic;

namespace CurrencyQuotation.Daos.Interfaces
{
    public interface ICurrencyQuotationDao
    {
        IList<Currency> GetQuotationByCurrencies(IList<string> currenciesName);
        decimal GetDolarAmountByName(string nameCurrency);
        void InsertNewCurrency(Currency currency);
        IList<Currency> GetAllCurrencies();
        void Update(Currency currency);
    }
}
