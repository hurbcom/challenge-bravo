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
        private readonly ICurrencyCache _currencyCache;

        public CurrencyService(ICurrencyRepository currencyRepository, ICurrencyCache currencyCache)
        {
            _currencyRepository = currencyRepository;
            _currencyCache = currencyCache;
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
            Currency currency = _currencyCache.TryGetCurrencyByNameInCache(currencyName);
            if (currency == null)
            {
                currency = _currencyRepository.GetCurrencyByName(currencyName);
                _currencyCache.AddCurrencyToCache(currency);
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

        public decimal ConvertAmountToCurrency(CurrencyToConvertDto currencyToConvertDto)
        {
            string fromCurrencyName = currencyToConvertDto.From;
            string toCurrencyName = currencyToConvertDto.To;
            decimal amountToConvert = currencyToConvertDto.Amount;

            Currency originalCurrency = this.GetCurrencyByName(fromCurrencyName);
            Currency newCurrency = this.GetCurrencyByName(toCurrencyName);

            decimal fromAmountInBaseCurrency = GetValueInBaseCurrency(originalCurrency, amountToConvert);
            decimal convertedAmount = GetValueInNewCurrency(newCurrency, fromAmountInBaseCurrency);

            return convertedAmount;
        }

        private decimal GetValueInBaseCurrency(Currency currency, decimal amount)
        {
            decimal convertFactor = this.GetConvertFactorIfValid(currency);

            decimal convertedAmount = amount / convertFactor;

            return convertedAmount;
        }

        private decimal GetValueInNewCurrency(Currency currency, decimal amount)
        {
            decimal convertFactor = this.GetConvertFactorIfValid(currency);

            decimal convertedAmount = amount * convertFactor;

            return convertedAmount;
        }

        private decimal GetConvertFactorIfValid(Currency currency)
        {
            decimal convertFactor = currency.ValueComparedToBaseCurrency;

            if (convertFactor <= 0)
            {
                string message = $"A Moeda {currency.Name} possui um valor de conversão {currency.ValueComparedToBaseCurrency}, o mesmo é inválido por ser negativo ou igual a zero.";
                throw new System.Exception(message);
            }
            else
            {
                return convertFactor;
            }
        }
    }
}
