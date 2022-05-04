using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.Core.Interfaces.Services;
using currency_conversion.Core.Models;
using Microsoft.Extensions.Options;
using currency_conversion.infrastructure.Configurations;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Collections.Generic;
using currency_conversion.infrastructure.DTOs;

namespace currency_conversion.infrastructure
{
    public class CurrencyFetch : ICurrencyFetch
    {
        private readonly ILogger<CurrencyFetch> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ICurrencyRepository _currencyRepository;
        private readonly string _apiUrl;

        public CurrencyFetch(ILogger<CurrencyFetch> logger, IHttpClientFactory httpClientFactory,
            ICurrencyRepository currencyRepository, IOptions<CoinBaseConfiguration> coinbaseConfiguration)
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _currencyRepository = currencyRepository;
            _apiUrl = coinbaseConfiguration.Value.ApiUrl;
        }

        public void UpdateCurrencies()
        {
            List<Currency> aa = new List<Currency>();

            var db = _currencyRepository.ReadAll().ToDictionary(c => c.Code);

            foreach (var a in aa)
            {
                Currency c;
                if (db.TryGetValue(a.Code, out c))
                {
                    c.Rate = a.Rate;
                }
                else
                {

                }
            }
            _currencyRepository.UpdateMany(db.Values.ToList());
        }

        public async Task FetchCurrenciesAsync()
        {
            _logger.LogInformation("Fetching currencies at " + _apiUrl);
            var httpRequestMessage = new HttpRequestMessage(
            HttpMethod.Get, _apiUrl);
            var httpClient = _httpClientFactory.CreateClient();
            var httpResponseMessage = await httpClient.SendAsync(httpRequestMessage);
            if (httpResponseMessage.IsSuccessStatusCode)
            {
                using var contentStream =
                    await httpResponseMessage.Content.ReadAsStreamAsync();
                if (contentStream != null)
                {
                    _logger.LogInformation(contentStream.ToString());
                    CoinBaseResponseDTO currencies = await JsonSerializer.DeserializeAsync
                    <CoinBaseResponseDTO>(contentStream);
                    _logger.LogInformation(currencies.ToString());
                }
                
            }
        }

    }
}
