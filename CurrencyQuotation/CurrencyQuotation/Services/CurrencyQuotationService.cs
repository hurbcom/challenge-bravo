using CurrencyQuotation.Daos.Interfaces;
using CurrencyQuotation.Models;
using CurrencyQuotation.Models.Dtos;
using CurrencyQuotation.Services.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CurrencyQuotation.Services
{
    public class CurrencyQuotationService : ICurrencyQuotationService
    {
        private const string DOLAR_CURRENCY = "USD";

        private readonly ILogger<CurrencyQuotationService> _logger;

        private readonly IRedisCacheService _redisCacheService;

        private readonly ICurrencyQuotationDao _currencyQuotationDao;

        public CurrencyQuotationService(ILogger<CurrencyQuotationService> logger,
            ICurrencyQuotationDao currencyQuotationDao, IRedisCacheService redisCacheService)
        {
            this._logger = logger;
            this._currencyQuotationDao = currencyQuotationDao;
            this._redisCacheService = redisCacheService;
        }

        public async Task<decimal> GetQuotation(string from, string to, decimal amount)
        {
            Currency fromCurrency = await GetCurrencyByName(from);
            Currency toCurrency = await GetCurrencyByName(to);

            if (fromCurrency == null || toCurrency == null)
            {
                throw new ArgumentNullException($"A moeda {from} ou a moeda {to} não foi encontrada");
            }

            return (toCurrency.DolarAmount / fromCurrency.DolarAmount) * amount;
        }

        public async Task<bool> InsertNewCurrency(CurrencyDto currencyDto)
        {
            try
            {
                if (string.IsNullOrEmpty(currencyDto.Name) || currencyDto.Amount <= 0)
                {
                    return false;
                }

                string baseQuotation = currencyDto.BaseQuotation ?? DOLAR_CURRENCY;
                decimal dolarAmountBaseQuotation = await this._currencyQuotationDao.GetDolarAmountByName(baseQuotation);
                decimal dolarAmountNewCurrency = currencyDto.Amount * dolarAmountBaseQuotation;

                Currency currency = new(currencyDto.Name, dolarAmountNewCurrency);
                await this._currencyQuotationDao.InsertNewCurrency(currency);

                _logger.LogInformation("Nova moeda salva com sucesso");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }
        }

        public async Task DeleteCurrencyByName(string name)
        {
            Currency currencyToRemove = await this._currencyQuotationDao.GetCurrencyByName(name);

            if (currencyToRemove == null)
            {
                throw new ArgumentNullException($"A moeda {name} não foi encontrada na base");
            }

            await this._currencyQuotationDao.DeleteByName(currencyToRemove);
        }

        public void SaveAll(IEnumerable<Currency> currencies)
        {
            foreach (Currency currency in currencies)
            {
                this._currencyQuotationDao.InsertNewCurrency(currency);
            }
        }

        public async Task<IList<Currency>> GetAllCurrencies()
        {
            return await this._currencyQuotationDao.GetAllCurrencies();
        }

        public void UpdateAll(IList<Currency> currenciesInDb)
        {
            foreach (Currency currency in currenciesInDb)
            {
                this._currencyQuotationDao.Update(currency);
            }
        }

        public async Task UpdateCurrencyByName(string name, decimal dolarAmount)
        {
            Currency currencyToUpdate = await this._currencyQuotationDao.GetCurrencyByName(name);

            if (currencyToUpdate == null)
            {
                throw new ArgumentNullException($"A moeda {name} não foi encontrada na base");
            }

            currencyToUpdate.DolarAmount = dolarAmount;

            this._currencyQuotationDao.Update(currencyToUpdate);
        }

        public async Task<Currency> GetCurrencyByName(string name)
        {
            string key = RedisCacheService.CreateKeyCacheByParams(name);

            Func<Task<Currency>> function = async () => await this._currencyQuotationDao.GetCurrencyByName(name);
            Currency currency = await this._redisCacheService.GetRedisCache<Currency>(function, key, TimeSpan.FromMinutes(60));

            return currency;
        }
    }
}
