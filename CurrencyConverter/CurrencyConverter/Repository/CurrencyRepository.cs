using CurrencyConverter.DBContexts;
using CurrencyConverter.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;

namespace CurrencyConverter.Repository
{
    public class CurrencyRepository : ICurrencyRepository
    {

        private CurrencyConverterContext _dbContext;

        private readonly string BASE_CURRENCY = "USD";

        private readonly Dictionary<Type, object> repositories = new Dictionary<Type, object>();

        public CurrencyRepository(CurrencyConverterContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void DeleteCurrency(string currencyName)
        {
            if (currencyName == BASE_CURRENCY)
            {
                string message = $"{BASE_CURRENCY} é a moeda base da API, a mesma não pode ser excluída.";
                throw new Exception(message);
            }

            Currency currency = GetCurrencyByName(currencyName);
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
            Currency currency = _dbContext.Currency.FirstOrDefault(bean => bean.Id == currencyId);
            if (currency != null)
            {
                return currency;
            }
            else
            {
                string message = $"Não foi possível encontrar a moeda com Id {currencyId} cadastrada na base de dados.";
                throw new ArgumentNullException(message);
            }
        }

        public Currency GetCurrencyByName(string currencyName)
        {
            Currency currency = _dbContext.Currency.FirstOrDefault(bean => bean.Name == currencyName);
            if (currency != null)
            {
                return currency;
            }
            else
            {
                string message = $"Não foi possível encontrar a moeda {currencyName} cadastrada na base de dados.";
                throw new ArgumentNullException(message);
            }
        }

        public IEnumerable<Currency> GetCurrencies()
        {
            return _dbContext.Currency.ToList();
        }

        public void InsertCurrency(Currency currency)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                _dbContext.Add(currency);
                Save();

                scope.Complete();
            }
        }

        public void InsertCurrenciesList(IList<Currency> currenciesList)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                _dbContext.AddRange(currenciesList);
                Save();

                scope.Complete();
            }
        }

        public void Save()
        {
            _dbContext.SaveChanges();
        }

        public void UpdateCurrenciesList(IList<Currency> currenciesList)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                _dbContext.UpdateRange(currenciesList);
                Save();

                scope.Complete();
            }
        }
    }
}
