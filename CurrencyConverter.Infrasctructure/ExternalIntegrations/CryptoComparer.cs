using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Domain.Interfaces;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Infrasctructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CurrencyConverter.Infrasctructure.ExternalIntegrations
{
    public class CryptoComparer : PriceIntegration, ICryptoComparer
    {
        protected IConfiguration config { get; set; }

        public CryptoComparer(IConfiguration config, IRepositoryBase<Configuration> repo, ILogger<CryptoComparer> logger) : base(repo, logger)
        {
            this.config = config;
        }

        public override string getUrl(string currencyName)
        {
            var marketURL = config.GetSection("externalURLs:cryptoCompare").Value;
            var URL = marketURL + $"data/price?fsym={currencyName}&tsyms={base.baseCurrency}";
            return URL;
        }

        public float GetLastestRate(string currency)
        {            
            string result = base.GrabLastPrice(currency);
            float rate = JsonConvert.DeserializeObject<Dictionary<string,float>>(result).FirstOrDefault().Value;
            return rate;
        }
    }
}
