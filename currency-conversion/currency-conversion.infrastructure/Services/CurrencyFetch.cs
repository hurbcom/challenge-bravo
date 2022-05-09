
using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.Core.Interfaces.Services;
using currency_conversion.Core.Models;
using currency_conversion.infrastructure.Configurations;
using currency_conversion.infrastructure.DTOs;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace currency_conversion.infrastructure
{
    public class CurrencyFetch : ICurrencyFetch
    {
        private readonly ILogger<CurrencyFetch> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ICurrencyRepository _currencyRepository;
        private readonly string _apiUrl;

        public CurrencyFetch(ILogger<CurrencyFetch> logger, IHttpClientFactory httpClientFactory,
            ICurrencyRepository currencyRepository)
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _currencyRepository = currencyRepository;
            _apiUrl = Environment.GetEnvironmentVariable("COINBASEAPI_URL") ?? "";
        }

        public async Task UpdateCurrenciesAsync()
        {
            IEnumerable<Currency>? apiCurrencies = await FetchCurrenciesAsync();
            if (apiCurrencies == null) return;

            var apiCurrenciesDict = apiCurrencies.ToDictionary(c => c.Code);

            var currenciesToUpdate = _currencyRepository.ReadAllNotCustom();

            foreach (var currencyToUpdate in currenciesToUpdate)
            {
                Currency? c;
                if (apiCurrenciesDict.TryGetValue(currencyToUpdate.Code, out c))
                {
                    currencyToUpdate.Rate = c.Rate;
                }
            }
            _currencyRepository.UpdateMany(currenciesToUpdate);
        }

        private async Task<IEnumerable<Currency>?> FetchCurrenciesAsync()
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
                    CoinBaseResponseDTO? currencies = await JsonSerializer.DeserializeAsync
                    <CoinBaseResponseDTO>(contentStream);
                    return currencies?.Data?.Rates?.Select(c => new Currency
                    {
                        Code = c.Key,
                        Rate = double.Parse(c.Value)
                    });
                }
            }
            return null;
        }
    }
}
