using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace CurrencyConverter.Service.Services
{
    public class ConverterSrvc : IConverterSrvc
    {
        private readonly ICacheBase _cache;
        private readonly ILogger<ConverterSrvc> _logger;

        public ConverterSrvc(ICacheBase cache, ILogger<ConverterSrvc> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public async Task<decimal> convertCurrencyAsync(string from, string to, decimal amount)
        {
            try
            {
                var fromRate = decimal.Parse(await fromCache(from));
                var toRate = decimal.Parse(await fromCache(to));

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

        public async Task<string> fromCache(string key)
        {
            try
            {
                return await _cache.GetAsync(key);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called fromCache failed to {key} with {ex.Message}");
                throw new Exception($"Key not in cache {key}");
            }
        }
    }
}
