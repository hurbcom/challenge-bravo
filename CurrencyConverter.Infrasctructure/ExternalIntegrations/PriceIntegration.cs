using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace CurrencyConverter.Infrasctructure.ExternalIntegrations
{
    public abstract class PriceIntegration : IPriceIntegration
    {
        private readonly IRepositoryBase<Configuration> _repo;
        protected readonly ILogger<CryptoComparer> logger;
        protected string baseCurrency { get; }

        public PriceIntegration(IRepositoryBase<Configuration> repo, ILogger<CryptoComparer> logger)
        {
            this.logger = logger;
            _repo = repo;
            baseCurrency = _repo.GetAll<Configuration>().ToList().FirstOrDefault().baseRate;
        }

        public abstract string getUrl(string currencyName);

        public string GrabLastPrice(string currencyName)
        {
            var url = getUrl(currencyName);
            var cli = new HttpClient();
            var response = cli.GetAsync(url).Result;

            if (response.IsSuccessStatusCode)
            {
                var content = response.Content.ReadAsStringAsync().Result;
                return content;
            }
            else
            {
                logger.LogError($"Error while grabbing last price for {currencyName}");
                throw new Exception($"Error while grabbing last price for {currencyName}");
            }           
        }
    }
}
