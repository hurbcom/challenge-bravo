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
