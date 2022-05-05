
using currency_conversion.infrastructure.Configurations;
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

        public async Task UpdateCurrenciesAsync()
        {
            IEnumerable<Currency>? apiCurrencies = await FetchCurrenciesAsync();
            if (apiCurrencies == null) return;

            var currenciesToUpdate = _currencyRepository.ReadAll().ToDictionary(c => c.Code);
            var currenciesToInsert = new List<Currency>();

            foreach (var apiCurrency in apiCurrencies)
            {
                Currency c;
                if (currenciesToUpdate.TryGetValue(apiCurrency.Code, out c))
                {
                    c.Rate = apiCurrency.Rate;
                }
                else
                {
                    currenciesToInsert.Add(apiCurrency);
                }
            }
            _currencyRepository.UpdateMany(currenciesToUpdate.Values.ToList());
            _currencyRepository.CreateMany(currenciesToInsert);
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
