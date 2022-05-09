using currency_conversion.Core.Interfaces.Services;

namespace currency_conversion.worker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;

        private readonly ICurrencyFetch _currencyFetch;

        private int _interval;

        public Worker(ILogger<Worker> logger, ICurrencyFetch currencyFetch)
        {
            _logger = logger;
            _currencyFetch = currencyFetch;
            int interval;
            var validInterval = int.TryParse(Environment.GetEnvironmentVariable("COINBASEAPI_FETCH_INTERVAL_MS"), out interval);
            _interval = validInterval ? interval : 300000;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                await Task.Delay(30000, stoppingToken);
                try
                {
                    await _currencyFetch.UpdateCurrenciesAsync();
                }
                catch (Exception e)
                {
                    _logger.LogError("Exception raise running updating currencies: " + e.Message + "\nStacktrace:\n" + e.StackTrace);
                }
                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}