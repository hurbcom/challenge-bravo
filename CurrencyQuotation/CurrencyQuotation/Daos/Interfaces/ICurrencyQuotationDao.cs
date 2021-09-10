using CurrencyQuotation.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CurrencyQuotation.Daos.Interfaces
{
    public interface ICurrencyQuotationDao
    {
        IList<Currency> GetQuotationByCurrencies(IList<string> currenciesName);
        Task<decimal> GetDolarAmountByName(string nameCurrency);
        Task InsertNewCurrency(Currency currency);
        IList<Currency> GetAllCurrencies();
        void Update(Currency currency);
        void DeleteByName(Currency currency);
        Currency GetCurrencyByName(string name);
    }
}
