using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace CurrencyConverter.Services
{
    public class CurrencyExternalApi : ICurrencyExternalApi
    {
        private readonly IHttpClientFactory _clientFactory;

        private readonly string ExternalApiAppId = "910033c6abca4a97ac057c1cffd24cb6";

        public CurrencyExternalApi(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        public async Task<string> GetActualCurrenciesNames()
        {
            string uri = $"https://openexchangerates.org/api/currencies.json?app_id={this.ExternalApiAppId}";

            string responseString = await this.SendHttpGetRequestToApi(uri);
            return responseString;
        }

        public async Task<decimal> GetActualCurrencyValueByName(string currencyName)
        {
            string uri = $"https://openexchangerates.org/api/latest.json?app_id={this.ExternalApiAppId}";
            string responseString = await this.SendHttpGetRequestToApi(uri);

            Dictionary<string, decimal> result = JObject.Parse(responseString)["rates"].ToObject<Dictionary<string, decimal>>();

            if (result.TryGetValue(currencyName, out decimal currencyValue))
            {
                return currencyValue;
            }
            else
            {
                string message = $"Não foi possível encontrar o valor referente a moeda {currencyName}.";
                throw new HttpRequestException(message);
            }
        }

        private async Task<string> SendHttpGetRequestToApi(string uri)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, uri);

            var client = _clientFactory.CreateClient();

            var response = await client.SendAsync(request).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                string responseString = await response.Content.ReadAsStringAsync();
                return responseString;
            }
            else
            {
                string message = "Não foi possível consultar a API Externa que fornece os valores das moedas.";
                throw new HttpRequestException(message);
            }
        }
    }
}
