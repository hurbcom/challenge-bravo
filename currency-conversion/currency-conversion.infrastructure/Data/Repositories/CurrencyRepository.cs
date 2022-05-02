using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.Core.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace currency_conversion.infrastructure.Data.Repositories
{
    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly AppDbContext _dbContext;
        public CurrencyRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public EntityEntry<Currency> Create(Currency currency)
        {
            var currencyAdded = _dbContext.Currency.Add(currency);
            _dbContext.SaveChanges();
            return currencyAdded;

        }

        public Currency? Read(string code)
        {
            return _dbContext.Currency.Find(code);
        }


        public EntityEntry<Currency> Update(Currency currency)
        {
            var currencyUpdated = _dbContext.Currency.Update(currency);
            currencyUpdated.Property(column => column.CreatedAt).IsModified = false;
            currencyUpdated.Property(column => column.UpdatedAt).IsModified = false;
            _dbContext.SaveChanges();
            return currencyUpdated;
        }

        public void Delete(string code)
        {
            var currency = _dbContext.Currency.Find(code);
            if(currency != null)
            {
                _dbContext.Currency.Remove(currency);
                _dbContext.SaveChanges();
            }
        }
    }
}
