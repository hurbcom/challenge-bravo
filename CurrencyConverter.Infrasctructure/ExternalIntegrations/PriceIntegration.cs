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
        public IRepositoryBase<Configuration> _repo;
        public ILogger<PriceIntegration> _logger;
        protected string baseCurrency { get; set; } = string.Empty;

        public PriceIntegration(IRepositoryBase<Configuration> repo, ILogger<PriceIntegration> logger)
        {
            _logger = logger;
            _repo = repo;
        }

        public abstract string getUrl(string currencyName);

        public virtual string GrabLastPrice(string currencyName)
        {
            try
            {
                if (!baseCurrency.Any())
                    baseCurrency = _repo.GetAll<Configuration>().ToList().FirstOrDefault().baseRate;

                var url = getUrl(currencyName);
                var response = GrabFromExternalSource(url);

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public virtual string GrabFromExternalSource(string url)
        {
            HttpClient cli = new HttpClient();
            var result = cli.GetAsync(url).Result;
            if (!result.IsSuccessStatusCode)
            {
                _logger.LogError($"Error while grabbing last price for {url}");
                throw new Exception($"Error while grabbing last price for {url}");
            }

            var content = result.Content.ReadAsStringAsync().Result;
            return content;
        }
    }
}
