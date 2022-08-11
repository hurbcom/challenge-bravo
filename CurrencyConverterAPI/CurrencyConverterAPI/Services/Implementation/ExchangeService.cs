using CurrencyConverterAPI.Configuration;
using CurrencyConverterAPI.CrossCutting.Log;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetExchangeRates", string.Empty);
            HttpResponseMessage response = await _httpClient.GetAsync($"{_config.BaseUrl}/exchange-rates?currency={_config.CurrencyBallast}");
            response.EnsureSuccessStatusCode();
            string result = response.Content.ReadAsStringAsync().Result;
            JObject rates = ParseResultResponseToJson(result);
            return CreateDictionaryToReturn(response, rates);
        }
        public async Task GetTestPolly(int code)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetTestPolly", string.Empty);
            var response = await _httpClient.GetAsync($"http://httpbin.org/status/{code}");
            _logger.LogInformation(response.IsSuccessStatusCode.ToString());
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
