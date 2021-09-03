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
    }
}
