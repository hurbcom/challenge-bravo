using CurrencyConverter.DBContexts;
using CurrencyConverter.Model;
using System;
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

        public void DeleteCurrency(string currencyName)
        {
            Currency currency = _dbContext.Currency.Where(bean => bean.Name == currencyName).FirstOrDefault();
            if (currency != null)
            {
                _dbContext.Currency.Remove(currency);
                Save();
            }
            else
            {
                string message = $"Não foi possível encontrar a moeda {currencyName} cadastrada na base de dados.";
                throw new ArgumentNullException(message);
            }
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
