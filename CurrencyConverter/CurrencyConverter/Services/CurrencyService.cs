using CurrencyConverter.Model;
using CurrencyConverter.Model.Dto;
using CurrencyConverter.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace CurrencyConverter.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly ICurrencyRepository _currencyRepository;
        private readonly ICurrencyCache _currencyCache;
        private readonly ICurrencyExternalApi _currencyExternalApi;

        public CurrencyService(ICurrencyRepository currencyRepository, ICurrencyCache currencyCache, ICurrencyExternalApi currencyExternalApi)
        {
            _currencyRepository = currencyRepository;
            _currencyCache = currencyCache;
            _currencyExternalApi = currencyExternalApi;
        }

        public void DeleteCurrency(string currencyName)
        {
            string normalizedCurrencyName = this.NormalizeCurrencyString(currencyName);
            using (TransactionScope scope = new TransactionScope())
            {
                _currencyRepository.DeleteCurrency(normalizedCurrencyName);
                scope.Complete();
                _currencyCache.CleanCache();
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

        public async Task<string> InsertCurrency(string currencyName)
        {
            string message;

            string normalizedCurrencyName = this.NormalizeCurrencyString(currencyName);
            decimal currencyValue = await _currencyExternalApi.GetActualCurrencyValueByName(normalizedCurrencyName);

            DateTime now = DateTime.Now;
            Currency currencyToAdd = new Currency(normalizedCurrencyName, currencyValue, now, now);

            _currencyRepository.InsertCurrency(currencyToAdd);

            message = $"A moeda {normalizedCurrencyName} foi cadastrada com sucesso!";
            return message;
        }

        public decimal ConvertAmountToCurrency(CurrencyToConvertDto currencyToConvertDto)
        {
            string fromCurrencyName = currencyToConvertDto.From;
            string toCurrencyName = currencyToConvertDto.To;

            int requiredNameLength = 3;
            if (fromCurrencyName.Length == requiredNameLength && toCurrencyName.Length == requiredNameLength)
            {
                decimal amountToConvert = currencyToConvertDto.Amount;

                Currency originalCurrency = this.GetCurrencyByName(fromCurrencyName);
                Currency newCurrency = this.GetCurrencyByName(toCurrencyName);

                decimal fromAmountInBaseCurrency = GetValueInBaseCurrency(originalCurrency, amountToConvert);
                decimal convertedAmount = GetValueInNewCurrency(newCurrency, fromAmountInBaseCurrency);

                return convertedAmount;
            }
            else
            {
                string message = "Pelo menos uma das moedas recebidas está diferente do padrão de 3 letras.";
                throw new ArgumentException(message);
            }
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

        private string NormalizeCurrencyString(string currencyName)
        {
            string normalizedCurrencyName = currencyName.Trim().ToUpper();
            return normalizedCurrencyName;
        }

        public void InsertCurrenciesList(IList<string> currenciesNames)
        {
            DateTime now = DateTime.Now;

            IList<Currency> currenciesList = new List<Currency>();

            foreach (string currencyName in currenciesNames)
            {
                string normalizedName = this.NormalizeCurrencyString(currencyName);
                decimal currencyValue = _currencyExternalApi.GetActualCurrencyValueByName(normalizedName).Result;

                Currency currencyToAdd = new Currency(normalizedName, currencyValue, now, now);

                currenciesList.Add(currencyToAdd);
            }

            _currencyRepository.InsertCurrenciesList(currenciesList);
        }

        public string GetAvailableCurrenciesToInsert()
        {
            return _currencyExternalApi.GetActualCurrenciesNames().Result;
        }

        public void UpdateAllCurrenciesValueInDatabase()
        {
            IList<Currency> currenciesInDatabase = _currencyRepository.GetCurrencies().ToList();

            DateTime now = DateTime.Now;

            foreach (Currency currency in currenciesInDatabase)
            {
                decimal currencyValue = _currencyExternalApi.GetActualCurrencyValueByName(currency.Name).Result;

                currency.ValueComparedToBaseCurrency = currencyValue;
                currency.UpdateDate = now;
            }

            _currencyRepository.UpdateCurrenciesList(currenciesInDatabase);
            _currencyCache.CleanCache();
        }
    }
}
