using CurrencyConverter.Model;
using CurrencyConverter.Repository;
using System.Collections.Generic;
using System.Transactions;

namespace CurrencyConverter.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly ICurrencyRepository _currencyRepository;

        public CurrencyService(ICurrencyRepository currencyRepository)
        {
            _currencyRepository = currencyRepository;
        }

        public void DeleteCurrency(string currencyName)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                _currencyRepository.DeleteCurrency(currencyName);
                scope.Complete();
            }
        }

        public Currency GetCurrencyById(long currencyId)
        {
            Currency currency = _currencyRepository.GetCurrencyById(currencyId);
            return currency;
        }

        public IEnumerable<Currency> GetCurrencies()
        {
            IEnumerable<Currency> currencies = _currencyRepository.GetCurrencies();
            return currencies;
        }

        public void InsertCurrency(Currency currency)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                _currencyRepository.InsertCurrency(currency);
                scope.Complete();
            }
        }
    }
}
