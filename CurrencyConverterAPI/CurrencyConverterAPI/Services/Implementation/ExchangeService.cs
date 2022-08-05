using CurrencyConverterAPI.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Polly.CircuitBreaker;
using System.Net.Http.Headers;

namespace CurrencyConverterAPI.Services.Implementation
{
    public class ExchangeService : IExchangeService
    {
        private readonly IApiConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly ILogger<ExchangeService> _logger;

        public ExchangeService(IApiConfiguration config, HttpClient httpClient, ILogger<ExchangeService> logger)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/xml"));
            _config = config;
            _logger = logger;
        }


        async Task<IDictionary<string, object>> IExchangeService.GetExchangeRates()
        {
            HttpResponseMessage response = await _httpClient.GetAsync($"{_config.BaseUrl}/exchange-rates?currency={_config.CurrencyBallast}");
            response.EnsureSuccessStatusCode();
            string result = response.Content.ReadAsStringAsync().Result;
            JObject rates = ParseResultResponseToJson(result);
            return CreateDictionaryToReturn(response, rates);
        }
        async Task IExchangeService.GetTestPolly(int code)
        {
            var response = await _httpClient.GetAsync($"http://httpbin.org/status/{code}");
            _logger.LogInformation(response.IsSuccessStatusCode.ToString());
            Console.WriteLine(response.IsSuccessStatusCode);
            response.EnsureSuccessStatusCode();
        }

        private static Dictionary<string, object> CreateDictionaryToReturn(HttpResponseMessage response, JObject rates)
        {
            var dic = new Dictionary<string, object>();
            dic.Add("status_code", response.StatusCode);
            dic.Add("rates", rates);
            return dic;
        }

        private static JObject ParseResultResponseToJson(string result)
        {
            var reader = new JsonTextReader(new StringReader(result));
            reader.FloatParseHandling = FloatParseHandling.Double;
            JObject obj = JObject.Load(reader);
            return obj["data"].Value<JObject>()["rates"].Value<JObject>();
        }
    }
}
