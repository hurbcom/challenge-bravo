using CurrencyConverter.Api.Models;
using CurrencyConverter.Api.Settings;
using freecurrencyapi;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace CurrencyConverter.Api.Services
{
    public class FiatConvertService : Service, IFiatConvertService
    {
        private readonly Freecurrencyapi _freecurrencyapi;

        public FiatConvertService(HttpClient httpClient, IOptions<AppSettings> appSettings)
        {
            _freecurrencyapi = new Freecurrencyapi(appSettings.Value.FreecurrencyapiKey);
        }

        public double ConvertFiatToFiat(string from, string to, double amount)
        {
            try
            {
                var currency = _freecurrencyapi.Latest(from, to);
                var quote = JsonSerializer.Deserialize<Quote>(currency);

                if (quote != null)
                {
                    var quoteValue = quote.data[to];
                    var response = amount * quoteValue;
                    return response;
                }
                throw new Exception($"Error executing FreecurrencyApi - Not supported currency: from {from} or to {to}");

            }
            catch (Exception ex)
            {
                throw new Exception("FreecurrencyApi error: " + ex.Message);
            }
        }
    }
}
