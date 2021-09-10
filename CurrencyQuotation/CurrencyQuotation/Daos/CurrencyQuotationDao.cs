using CurrencyQuotation.Daos.Interfaces;
using CurrencyQuotation.DatabaseContext;
using CurrencyQuotation.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public Task<decimal> GetDolarAmountByName(string nameCurrency)
        {
            IQueryable<Currency> queryable = GetByName(nameCurrency);
            return Task.FromResult(queryable.Select(bean => bean.DolarAmount).First());
        }

        public async Task InsertNewCurrency(Currency currency)
        {
            this._context.Currency.AddAsync(currency);
            await this._context.SaveChangesAsync();
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

        public async Task DeleteByName(Currency currency)
        {
            this._context.Currency.Remove(currency);
            await this._context.SaveChangesAsync();
        }

        public Task<Currency> GetCurrencyByName(string name)
        {
            IQueryable<Currency> queryable = GetByName(name);
            return Task.FromResult(queryable.FirstOrDefault());
        }

        private IQueryable<Currency> GetByName(string nameCurrency)
        {
            return this._context.Currency.Where(c => nameCurrency.Equals(c.Name));
        }
    }
}
