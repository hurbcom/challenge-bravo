using CurrencyQuotation.Daos.Interfaces;
using CurrencyQuotation.DatabaseContext;
using CurrencyQuotation.Models;
using System.Collections.Generic;
using System.Linq;

namespace CurrencyQuotation.Daos
{
    public class CurrencyQuotationDao : ICurrencyQuotationDao
    {
        public readonly QuotationContext _context;

        public CurrencyQuotationDao(QuotationContext context)
        {
            this._context = context;
        }

        public IList<Currency> GetQuotationByCurrencies(IList<string> currenciesName)
        {
            return this._context.Currency
               .Where(c => currenciesName.Contains(c.Name))
               .ToList();
        }

        public decimal GetDolarAmountByName(string nameCurrency)
        {
            return this._context.Currency
                           .Where(c => nameCurrency.Equals(c.Name))
                           .Select(bean => bean.DolarAmount)
                           .First();
        }

        public void InsertNewCurrency(Currency currency)
        {
            this._context.Currency.Add(currency);
            this._context.SaveChanges();
        }
    }
}
