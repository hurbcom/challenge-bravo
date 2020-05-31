using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System;

namespace CurrencyConverter.Service.Services
{
    public class PriceSrvc : IPriceSrvc
    {
        private readonly ICryptoComparer _cryptoComparer;
        private readonly IRepositoryBase<Currency> _repo;
        private readonly IDistributedCache _cache;
        private readonly ILogger<PriceSrvc> _logger;

        public PriceSrvc(ICryptoComparer cryptoComparer, IRepositoryBase<Currency> repo, IDistributedCache cache, ILogger<PriceSrvc> logger)
        {
            _cryptoComparer = cryptoComparer;
            _repo = repo;
            _cache = cache;
            _logger = logger;
        }

        public float Convert(string from, string to, float amount)
        {
            try
            {
                var fromRate = float.Parse(_cache.GetString(from));
                var toRate = float.Parse(_cache.GetString(to));

                var fromAmount = amount * fromRate;
                var toAmount = fromAmount / toRate;

                return toAmount;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called Convert failed with {ex.Message}");
                throw new Exception($"Converter failed");
            }
        }

        public bool UpdateRate(Currency currency)
        {
            try
            {
                var latestRate = _cryptoComparer.GetLastestRate(currency.name);
                currency.rate = latestRate;
                currency.lastUpdate = DateTime.Now;
                if (_repo.Update<Currency>(currency))
                {
                    _cache.SetString(currency.name, latestRate.ToString());
                }
                else
                {
                    _logger.LogError($"Database update failed to {currency.name}");
                    throw new Exception($"Database update failed");
                }
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called UpdateRate failed with {ex.Message}");
                throw new Exception($"Update rate failed");
            }
        }
    }
}
