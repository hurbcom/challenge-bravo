using CurrencyConverter.DBContexts;
using CurrencyConverter.Model;
using System.Collections.Generic;
using System.Linq;

namespace CurrencyConverter.Repository
{
    public class CurrencyRepository : ICurrencyRepository
    {

        private readonly CurrencyConverterContext _dbContext;

        public CurrencyRepository(CurrencyConverterContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void DeleteCurrency(long currencyId)
        {
            Currency currency = _dbContext.Currency.Find(currencyId);
            _dbContext.Currency.Remove(currency);
            Save();
        }

        public Currency GetCurrencyById(long currencyId)
        {
            return _dbContext.Currency.Find(currencyId);
        }

        public IEnumerable<Currency> GetCurrencies()
        {
            return _dbContext.Currency.ToList();
        }

        public void InsertCurrency(Currency currency)
        {
            _dbContext.Add(currency);
            Save();
        }

        public void Save()
        {
            _dbContext.SaveChanges();
        }
    }
}
