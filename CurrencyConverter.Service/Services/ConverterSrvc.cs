using CurrencyConverter.Service.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace CurrencyConverter.Service.Services
{
    public class ConverterSrvc : IConverterSrvc
    {
        private readonly IDistributedCache _cache;
        private readonly ILogger<ConverterSrvc> _logger;

        public ConverterSrvc(IDistributedCache cache, ILogger<ConverterSrvc> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public async Task<decimal> convertCurrencyAsync(string from, string to, decimal amount)
        {
            try
            {
                var fromRate = decimal.Parse(await _cache.GetStringAsync(from));
                var toRate = decimal.Parse(await _cache.GetStringAsync(to));

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
    }
}
