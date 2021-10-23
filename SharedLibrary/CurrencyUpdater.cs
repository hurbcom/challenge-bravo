using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RestSharp;
using SharedLibrary.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace SharedLibrary
{
    public class UpdaterHostedService : IHostedService, IDisposable
    {
        private readonly ILogger<UpdaterHostedService> _logger;

        private string _apiUrl            = "https://economia.awesomeapi.com.br/json/last/{0}-{1}";
        private string _defaultCurrency   = "USD";
        private RestClient _client        { get; set; }

        private readonly IServiceScopeFactory _scopeFactory;

        private int _sleepTimeMinutes     { get; set; }

        private Timer _timer              { get; set; }
        
        public UpdaterHostedService(ILogger<UpdaterHostedService> logger, IServiceScopeFactory scopeFactory)
        {
            _logger              = logger;

            _sleepTimeMinutes    = 5;
            _client              = new RestClient(_apiUrl);
            _scopeFactory        = scopeFactory;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Currency updater running");

            // Use a time to wait before trying to get a updated price value
            _timer = new Timer(Work, null, TimeSpan.Zero,
                TimeSpan.FromMinutes(_sleepTimeMinutes));

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Currency updater finished");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

        private void Work(object state)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                SQLLiteDbContext _dbService = scope.ServiceProvider.GetRequiredService<SQLLiteDbContext>();

                try
                {
                    IEnumerable<CurrencyObject> currencies = _dbService.FindAll().Result;
                    if (currencies == null)
                    {
                        _logger.LogError("Could not get list of available currencies");
                        return;
                    }

                    // Work on each available currency
                    foreach (CurrencyObject currency in currencies)
                    {
                        if (!currency.AutoUpdateRate)
                            continue;
                        
                        // Get API response with current rate value
                        string finalUrl         = String.Format(_apiUrl, currency.Name, _defaultCurrency);
                        RestRequest request     = new RestRequest(finalUrl);
                        IRestResponse response  = _client.Get(request);
                        if (response == null || !response.IsSuccessful)
                        {
                            _logger.LogError("Could not get expected response with updated rate value for " + currency.Name);
                            continue;
                        }

                        string jsonResponse = response.Content;
                        if (String.IsNullOrWhiteSpace(jsonResponse) || jsonResponse.IndexOf("CoinNotExists", StringComparison.OrdinalIgnoreCase) > -1)
                            continue;
                        double newRate = -1;

                        try
                        {
                            RootResponseObject responseObj  = JsonConvert.DeserializeObject<RootResponseObject>(jsonResponse);
                            string newRateText              = responseObj.First().Value.bid;
                            newRate                         = Double.Parse(newRateText, CultureInfo.InvariantCulture);
                        }
                        catch (Exception)
                        {
                            _logger.LogError("Could not convert response with updated rate value for " + currency.Name);
                            continue;
                        }

                        currency.Price  = newRate;
                        bool result     = _dbService.Update(currency).Result;
                        if(!result)
                        {
                            _logger.LogError("Could not get update object for " + currency.Name);
                            continue;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(String.Format("Exception found when trying to update currency values: {0} :: {1}", ex.Message, ex.StackTrace));
                }

            }
        }
    }
}
