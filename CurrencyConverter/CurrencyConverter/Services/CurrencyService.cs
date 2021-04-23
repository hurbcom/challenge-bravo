using CurrencyConverter.Model;
using CurrencyConverter.Model.Dto;
using CurrencyConverter.Repository;
using System.Collections.Generic;
using System.Transactions;

namespace CurrencyConverter.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly ICurrencyRepository _currencyRepository;

        private static readonly IDictionary<string, Currency> CurrenciesByNameCache = new Dictionary<string, Currency>();

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

        public Currency GetCurrencyByName(string currencyName)
        {
            if (!CurrenciesByNameCache.TryGetValue(currencyName, out Currency currency))
            {
                currency = _currencyRepository.GetCurrencyByName(currencyName);
                try
                {
                    CurrenciesByNameCache.Add(currencyName, currency);
                }
                catch
                {
                    //Caso tenha sido adicionada por outra requisicao durante consulta no DB.
                    currency = CurrenciesByNameCache[currencyName];
                }
            }
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

        {
        }
    }
}
