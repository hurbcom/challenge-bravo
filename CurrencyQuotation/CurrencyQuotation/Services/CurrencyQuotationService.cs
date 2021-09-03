using CurrencyQuotation.Daos.Interfaces;
using CurrencyQuotation.Services.Interfaces;

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
            decimal result = this._currencyQuotationDao.GetQuotationByCurrencies(from, to, amount);
            return result;
        }
    }
}
