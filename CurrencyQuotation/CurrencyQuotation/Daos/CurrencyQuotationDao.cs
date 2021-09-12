using CurrencyQuotation.Daos.Interfaces;
using CurrencyQuotation.DatabaseContext;
using CurrencyQuotation.Models;
using Microsoft.EntityFrameworkCore;
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
            await this._context.Currency.AddAsync(currency);
            await this._context.SaveChangesAsync();
        }

        public async Task<IList<Currency>> GetAllCurrencies()
        {
            return await this._context.Currency.ToListAsync();
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

        public async Task<Currency> GetCurrencyByName(string name)
        {
            IQueryable<Currency> queryable = GetByName(name);
            return await queryable.FirstOrDefaultAsync();
        }

        private IQueryable<Currency> GetByName(string nameCurrency)
        {
            return this._context.Currency.Where(c => c.Name.Equals(nameCurrency));
        }

        public void SaveAll(IEnumerable<Currency> currencies)
        {
            this._context.Currency.AddRange(currencies);
            this._context.SaveChanges();
        }
    }
}
