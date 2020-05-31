using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Net.Http;

namespace CurrencyConverter.Infrasctructure.ExternalIntegrations
{
    public abstract class PriceIntegration : IPriceIntegration
    {
        private readonly IRepositoryBase<Configuration> _repo;
        protected readonly ILogger<CryptoComparer> logger;
        protected string baseCurrency { get; set; } = "";

        public PriceIntegration(IRepositoryBase<Configuration> repo, ILogger<CryptoComparer> logger)
        {
            this.logger = logger;
            _repo = repo;
        }

        public abstract string getUrl(string currencyName);

        public string GrabLastPrice(string currencyName)
        {
            if (!baseCurrency.Any())
                baseCurrency = _repo.GetAll<Configuration>().ToList().FirstOrDefault().baseRate;

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
