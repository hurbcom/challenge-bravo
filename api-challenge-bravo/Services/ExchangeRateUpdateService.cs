using System;
using System.Globalization;
using api_challenge_bravo.Model;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace api_challenge_bravo.Services
{
    public static class ExchangeRateUpdateService
    {
        static int countExternalCalls = 1;
        private const int TIME_TO_LIVE_EXCHANGE_RATE_SECONDS = 30;
        static SemaphoreSlim mutex = new SemaphoreSlim(1,1);

        private static async Task Update(Currency currency)
        {
            decimal newExchangeRat;
            DateTime dateTimeUpdate;

            try
            {
                (newExchangeRat, dateTimeUpdate) = await CallExternalAwesomeApi(currency.Symbol);
            }
            catch (Exception exception)
            {
                throw new Exception("External API error:",exception);
            }

            currency.UpdateExchangeRate(newExchangeRat, dateTimeUpdate);
        }

        public static async Task CheckTTLForNewUpdate(Currency currency)
        {
            if (!currency.AutoUpdateExchangeRate)
                return;

            // Only one thread by time can check if the currency need an update, making this a thread-safe logic
            await mutex.WaitAsync();
            try
            {
                if (currency.LastTimeUpdatedExchangeRate == null
                    || currency.LastTimeUpdatedExchangeRate <=
                    DateTime.Now.AddSeconds(-TIME_TO_LIVE_EXCHANGE_RATE_SECONDS))
                    await Update(currency);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                mutex.Release();
            }

        }

        private static async Task<Tuple<decimal,DateTime>> CallExternalAwesomeApi(string symbol)
        {
            string baseURL = "https://economia.awesomeapi.com.br/";
            string path = $"last/{symbol.ToUpper()}-USD";

            HttpClient req = new HttpClient();
            var content = await req.GetAsync(baseURL + path);
            var response = JObject.Parse(await content.Content.ReadAsStringAsync());

            var newExchangeRat = Decimal.Parse(response[$"{symbol}USD"]["bid"].ToString(),CultureInfo.InvariantCulture);
            var dateTimeUpdate = DateTime.Parse(content.Headers.Date.ToString());

            Console.WriteLine("Calling external API: #" + countExternalCalls++);
            return Tuple.Create(newExchangeRat,dateTimeUpdate);
        }
    }
}