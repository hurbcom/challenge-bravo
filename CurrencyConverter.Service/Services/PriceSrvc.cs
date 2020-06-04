using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using Microsoft.Extensions.Logging;
using System;

namespace CurrencyConverter.Service.Services
{
    public class PriceSrvc : IPriceSrvc
    {
        private readonly ICryptoComparer _cryptoComparer;
        private readonly IRepositoryBase<Currency> _repo;
        private readonly ICacheBase _cache;
        private readonly ILogger<PriceSrvc> _logger;

        public PriceSrvc(ICryptoComparer cryptoComparer, IRepositoryBase<Currency> repo, ICacheBase cache, ILogger<PriceSrvc> logger)
        {
            _cryptoComparer = cryptoComparer;
            _repo = repo;
            _cache = cache;
            _logger = logger;
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
                    _cache.SetAsync(currency.name, latestRate.ToString());
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
