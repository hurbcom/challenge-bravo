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

            decimal result = (toCurrency.DolarAmount / fromCurrency.DolarAmount) * amount;
            return result;
        }

        public bool InsertNewCurrency(CurrencyDto currencyDto)
        {
            try
            {
                string baseQuotation = currencyDto.BaseQuotation ?? DOLAR_CURRENCY;
                decimal dolarAmountForRealCurrency = this._currencyQuotationDao.GetDolarAmountByName(baseQuotation);
                decimal dolarAmountNewCurrency = currencyDto.Amount * dolarAmountForRealCurrency;

                Currency currency = new(currencyDto.Name, dolarAmountNewCurrency);
                this._currencyQuotationDao.InsertNewCurrency(currency);

                _logger.LogInformation("Nova moeda salva com sucesso");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }
        }

        public void DeleteCurrencyByName(string name)
        {
            Currency currencyToRemove = this._currencyQuotationDao.GetCurrencyByName(name);

            this._currencyQuotationDao.DeleteByName(currencyToRemove);
        }

        public void SaveAll(IEnumerable<Currency> currencies)
        {
            foreach (Currency currency in currencies)
            {
                this._currencyQuotationDao.InsertNewCurrency(currency);
            }
        }

        public IList<Currency> GetAllCurrencies()
        {
            return this._currencyQuotationDao.GetAllCurrencies();
        }

        public void UpdateAll(IList<Currency> currenciesInDb)
        {
            foreach (Currency currency in currenciesInDb)
            {
                this._currencyQuotationDao.Update(currency);
            }
        }

        public void UpdateCurrencyByName(string name, decimal dolarAmount)
        {
            Currency currencyToUpdate = this._currencyQuotationDao.GetCurrencyByName(name);
            currencyToUpdate.DolarAmount = dolarAmount;

            this._currencyQuotationDao.Update(currencyToUpdate);
        }

        public async Task<Currency> GetCurrencyByName(string name)
        {
            string key = RedisCacheService.CreateKeyCacheByParams(name);

            Func<Currency> func = () => this._currencyQuotationDao.GetCurrencyByName(name);

            Currency currency = await this._redisCacheService.GetRedisCache<Currency>(func, key, TimeSpan.FromMinutes(60));

            return currency;
        }
    }
}
