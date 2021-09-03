using CurrencyQuotation.Models;
using System.Collections.Generic;

namespace CurrencyQuotation.Daos.Interfaces
{
    public interface ICurrencyQuotationDao
    {
        IList<Currency> GetQuotationByCurrencies(IList<string> currenciesName);
    }
}
