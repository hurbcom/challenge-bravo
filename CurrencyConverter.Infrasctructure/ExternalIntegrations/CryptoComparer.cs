using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CurrencyConverter.Infrasctructure.ExternalIntegrations
{
    public class CryptoComparer : PriceIntegration, ICryptoComparer
    {
        protected IConfiguration config { get; set; }
        private readonly ILogger<CryptoComparer> _logger;

        public CryptoComparer(IConfiguration config, IRepositoryBase<Configuration> repo, ILogger<CryptoComparer> logger) : base(repo, logger)
        {
            this.config = config;
            _logger = logger;
        }

        public override string getUrl(string currencyName)
        {
            try
            {
                var marketURL = config.GetSection("externalURLs:cryptoCompare").Value;
                var URL = marketURL + $"data/price?fsym={currencyName}&tsyms={base.baseCurrency}";
                return URL;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called getUrl returned error: {ex.Message}");
                throw ex;
            }
        }

        public decimal GetLastestRate(string currency)
        {
            try
            {
                string result = base.GrabLastPrice(currency);
                decimal rate = JsonConvert.DeserializeObject<Dictionary<string, decimal>>(result).FirstOrDefault().Value;
                return rate;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error while parsing last price for {currency}. {ex.Message}");
                throw new Exception($"Cannot locate rate for {currency}");
            }
        }
    }
}
