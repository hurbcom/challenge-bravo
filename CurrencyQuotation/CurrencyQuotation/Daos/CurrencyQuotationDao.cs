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
            IQueryable<Currency> queryable = GetByName(nameCurrency);
            return queryable.Select(bean => bean.DolarAmount).First();
        }

        public void InsertNewCurrency(Currency currency)
        {
            this._context.Currency.Add(currency);
            this._context.SaveChanges();
        }

        public IList<Currency> GetAllCurrencies()
        {
            return this._context.Currency.ToList();
        }

        public void Update(Currency currency)
        {
            this._context.Currency.Update(currency);
            this._context.SaveChanges();
        }

        public void DeleteByName(Currency currency)
        {
            this._context.Currency.Remove(currency);
            this._context.SaveChanges();
        }

        public Currency GetCurrencyByName(string name)
        {
            IQueryable<Currency> queryable = GetByName(name);
            return queryable.FirstOrDefault();
        }

        private IQueryable<Currency> GetByName(string nameCurrency)
        {
            return this._context.Currency.Where(c => nameCurrency.Equals(c.Name));
        }
    }
}
