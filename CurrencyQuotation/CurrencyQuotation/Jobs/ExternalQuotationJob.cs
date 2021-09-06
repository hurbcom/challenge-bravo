using CurrencyQuotation.Models;
using CurrencyQuotation.Models.Dtos;
using CurrencyQuotation.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CurrencyQuotation.Jobs
{
    public class ExternalQuotationJob : IHostedService
    {
        private readonly ILogger<ExternalQuotationJob> _logger;

        public readonly IServiceScopeFactory _serviceScopeFactory;

        private IExternalQuotationApiService ExternalQuotationApiService { get; set; }
        private ICurrencyQuotationService CurrencyQuotationService { get; set; }
        public Timer Timer { get; set; }

        public ExternalQuotationJob(
            ILogger<ExternalQuotationJob> logger,
            IServiceScopeFactory serviceScopeFactory)
        {
            this._logger = logger;
            this._serviceScopeFactory = serviceScopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            this._logger.LogInformation("INIT - ExternalQuotationJob");

            using (var scope = _serviceScopeFactory.CreateScope())
            {
                this.ExternalQuotationApiService = scope.ServiceProvider.GetRequiredService<IExternalQuotationApiService>();
                this.CurrencyQuotationService = scope.ServiceProvider.GetRequiredService<ICurrencyQuotationService>();

                //Do your stuff
                this.Timer = new Timer(Execute, null, TimeSpan.Zero, TimeSpan.FromHours(1));
            }

            return Task.CompletedTask;
        }

        private void Execute(object state)
        {
            ExternalApiDto externalApiDto = this.ExternalQuotationApiService.GetCurrenciesQuotationsInDolar();

            IList<Currency> currenciesInDb = this.CurrencyQuotationService.GetAllCurrencies();

            if (currenciesInDb.Any())
            {
                IDictionary<string, decimal> rates = externalApiDto.Rates;

                foreach (Currency currencyToUpdate in currenciesInDb)
                {
                    currencyToUpdate.DolarAmount = rates.ContainsKey(currencyToUpdate.Name) ? rates[currencyToUpdate.Name] : currencyToUpdate.DolarAmount;
                }

                this.CurrencyQuotationService.UpdateAll(currenciesInDb);
            }
            else
            {
                IEnumerable<Currency> currenciesToSave = externalApiDto.Rates.Select(bean => new Currency(bean.Key, bean.Value));
                this.CurrencyQuotationService.SaveAll(currenciesToSave);
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            this._logger.LogInformation("END - ExternalQuotationJob");
            return Task.CompletedTask;
        }
    }
}
