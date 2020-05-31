using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CurrencyConverter.Service.Services
{
    public class CurrencySrvc : ICurrencySrvc
    {
        private readonly IRepositoryBase<Currency> _repoCurrency;
        private readonly Configuration _config;
        private readonly IPriceSrvc _price;
        private readonly IDistributedCache _cache;
        private readonly ILogger<CurrencySrvc> _logger;

        public CurrencySrvc(IRepositoryBase<Currency> repoCurrency, IRepositoryBase<Configuration> repoConfig, IPriceSrvc price, IDistributedCache cache, ILogger<CurrencySrvc> logger)
        {
            _repoCurrency = repoCurrency;
            _config = repoConfig.GetAll<Configuration>().ToList().FirstOrDefault();
            _price = price;
            _cache = cache;
            _logger = logger;
        }

        public Currency AddCurrency(string currencyName)
        {
            Currency currency = new Currency();

            var result = GetAll().ToList().Where(c => c.name.Contains(currencyName));
            if (result.Any())
            {
                currency = result.FirstOrDefault();
                if (currency.isActive)
                {
                    return currency;
                }

                currency.isActive = true;
            }
            else
            {
                currency.name = currencyName;
                currency.@base = _config.baseRate;
            }

            if (_price.UpdateRate(currency))
            {
                return currency;
            }
            else
            {
                _logger.LogError($"Called AddCurrency failed for currency name {currencyName}");
                throw new Exception($"Cannot create currency {currencyName}");
            }
        }

        public bool DeleteCurrency(string currencyName)
        {
            var result = GetAllActive().ToList().Where(c => c.name.Contains(currencyName));
            
            if (result.Any())
            {
                var item = result.FirstOrDefault();
                item.isActive = false;
                _cache.Remove(currencyName);
                return _repoCurrency.Update<Currency>(item);
            }
            else
            {
                _logger.LogError($"Called DeleteCurrency cannot found any currency for {currencyName}");
                return false;
            }
        }

        public IEnumerable<Currency> GetAll()
        {
            return _repoCurrency.GetAll<Currency>();
        }

        public IEnumerable<Currency> GetAllActive()
        {
            return _repoCurrency.GetAll<Currency>(i => i.isActive == true);
        }

        public bool SyncAllActiveCurrencyRates()
        {
            var allCurrencies = GetAllActive();

            foreach (var item in allCurrencies)
            {
                if (!_price.UpdateRate(item))
                {
                    _logger.LogError($"Called SyncAllActiveCurrencyRates cannot update rate for {item.name}");
                    return false;
                }
            };
            return true;
        }
    }
}
