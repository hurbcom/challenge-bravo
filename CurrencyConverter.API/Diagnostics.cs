using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using Hangfire;
using Hangfire.Storage;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

namespace CurrencyConverter.API
{
    public interface IDiagnostics
    {
        bool ExternalConnection();

        bool BackgroundWorkers();

        bool CacheServer();

        bool Database();
    }

    public class Diagnostics : IDiagnostics
    {
        private readonly ILogger<Diagnostics> _logger;
        private readonly ICryptoComparer _cryptoComparer;
        private readonly IDistributedCache _cache;
        private readonly IRepositoryBase<Configuration> _repo;

        public Diagnostics(ILogger<Diagnostics> logger, ICryptoComparer cryptoComparer, IDistributedCache cache, IRepositoryBase<Configuration> repo)
        {
            _logger = logger;
            _cryptoComparer = cryptoComparer;
            _cache = cache;
            _repo = repo;
        }

        public bool ExternalConnection()
        {
            try
            {
                var rate = _cryptoComparer.GetLastestRate("BRL");
                if (rate > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
                return false;
            }
        }

        public bool BackgroundWorkers()
        {
            IMonitoringApi monitoringApi = JobStorage.Current.GetMonitoringApi();
            return monitoringApi.Servers().Any();
        }

        public bool CacheServer()
        {
            try
            {
                _cache.SetString("beat", "true");
                return bool.Parse(_cache.GetString("beat"));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
                return false;
            }
        }

        public bool Database()
        {
            try
            {
                return _repo.GetAll<Configuration>().ToList().Any();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
                return false;
            }
        }
    }
}