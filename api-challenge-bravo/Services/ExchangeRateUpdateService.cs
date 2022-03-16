using System;
using System.Globalization;
using api_challenge_bravo.Model;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace api_challenge_bravo.Services
{
    public class ExchangeRateUpdateService
    {
        private const int TIME_TO_LIVE_EXCHANGE_RATE_SECONDS = 30;
        private static async Task Update(Currency currency)
        {
            JObject response;
            // Need to add some lock, only one thread should update ExchangeRate from each symbol
            try
            {
                response = await CallExternalAwesomeApi(currency.Symbol);

                var newExchangeRat = Decimal.Parse(response[$"{currency.Symbol}USD"]["bid"].ToString(),CultureInfo.InvariantCulture);
                var dateTimeUpdate = DateTime.Parse(response[$"{currency.Symbol}USD"]["create_date"].ToString());

                currency.UpdateExchangeRate(newExchangeRat, dateTimeUpdate);
            }
            catch (Exception exception)
            {
                throw new Exception("External API error:",exception);
            }
        }

        public static async Task CheckTTLForNewUpdate(Currency currency)
        {
            if (!currency.AutoUpdateExchangeRate)
                return;
            if (currency.LastTimeUpdatedExchangeRate == null
                || currency.LastTimeUpdatedExchangeRate <= DateTime.Now.AddSeconds(-TIME_TO_LIVE_EXCHANGE_RATE_SECONDS))
                await Update(currency);
        }

        private static async Task<JObject> CallExternalAwesomeApi(string symbol)
        {
            string baseURL = "https://economia.awesomeapi.com.br/";
            string path = $"last/{symbol.ToUpper()}-USD";

            HttpClient req = new HttpClient();
            var content = await req.GetAsync(baseURL + path);
            return JObject.Parse(await content.Content.ReadAsStringAsync());
        }
    }
}