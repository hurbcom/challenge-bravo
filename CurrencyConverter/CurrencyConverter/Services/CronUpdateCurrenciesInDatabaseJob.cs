using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace CurrencyConverter.Services
{
    public class CronUpdateCurrenciesInDatabaseJob : CronJobService
    {
        private readonly ILogger<CronUpdateCurrenciesInDatabaseJob> _logger;
        private readonly IHttpClientFactory _clientFactory;

        public CronUpdateCurrenciesInDatabaseJob(IScheduleConfig<CronUpdateCurrenciesInDatabaseJob> config, ILogger<CronUpdateCurrenciesInDatabaseJob> logger, IHttpClientFactory clientFactory)
            : base(config.CronExpression, config.TimeZoneInfo)
        {
            _logger = logger;
            _clientFactory = clientFactory;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("CronUpdateCurrenciesInDatabaseJob starts.");
            return base.StartAsync(cancellationToken);
        }

        public async override Task DoWork(CancellationToken cancellationToken)
        {
            _logger.LogInformation($"{DateTime.Now:hh:mm:ss} CronUpdateCurrenciesInDatabaseJob is working.");

            string uri = "http://localhost:80/api/currencyconverter/updateAllCurrenciesValue";

            var request = new HttpRequestMessage(HttpMethod.Put, uri);

            var client = _clientFactory.CreateClient();

            var response = await client.SendAsync(request).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                return;
            }
            else
            {
                string message = "Ocorreu um erro na execução da atualização das moedas cadastradas.";
                throw new HttpRequestException(message);
            }
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("CronUpdateCurrenciesInDatabaseJob is stopping.");
            return base.StopAsync(cancellationToken);
        }
    }
}
