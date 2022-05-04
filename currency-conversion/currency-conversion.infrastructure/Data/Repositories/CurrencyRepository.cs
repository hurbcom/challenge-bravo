using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.Core.Models;
using EntityFramework.Exceptions.Common;
using Microsoft.EntityFrameworkCore;

namespace currency_conversion.infrastructure.Data.Repositories
{
    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly AppDbContext _dbContext;
        public CurrencyRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool Create(Currency currency)
        {
            currency.Code = currency.Code.ToUpper();
            _dbContext.Currency.Add(currency);
            try
            {
                _dbContext.SaveChanges();
                return true;
            }
            catch (UniqueConstraintException)
            {
                return false;
            }
        }

        public void CreateMany(IEnumerable<Currency> currencies)
        {
            _dbContext.Currency.AddRange(currencies);
            _dbContext.SaveChanges();
        }

        public Currency? Read(string code)
        {
            var currencyRead = _dbContext.Currency.Find(code);
            return currencyRead;
        }

        public List<Currency> ReadAll()
        {
            var currencyRead = _dbContext.Currency.ToList();
            return currencyRead;
        }

        public bool Update(Currency currency)
        {
            var currencyFound = _dbContext.Currency.AsNoTracking().SingleOrDefault(c => c.Code == currency.Code);
            if (currencyFound != null)
            {
                var currencyUpdated = _dbContext.Currency.Update(currency);
                currencyUpdated.Property(column => column.CreatedAt).IsModified = false;
                currencyUpdated.Property(column => column.UpdatedAt).IsModified = false;
                _dbContext.SaveChanges();
                return true;
            }
            return false;
        }

        public void UpdateMany(IEnumerable<Currency> currencies)
        {
            _dbContext.UpdateRange(currencies);
            _dbContext.SaveChanges();
        }

        public bool Delete(string code)
        {
            //if (currency == null) throw new KeyNotFoundException("Currency not found: " + code);
            var currency = _dbContext.Currency.Find(code);
            if (currency != null)
            {
                var currencyEntity = _dbContext.Currency.Remove(currency);
                _dbContext.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
