using System;
using System.Globalization;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace api_challenge_bravo.Services.Util
{
    public static class ExternalAPI
    {
        private static int countExternalCalls = 1;

        internal static async Task<Tuple<decimal,DateTime>> CallAwesomeApi(string symbol)
        {
            string baseURL = "https://economia.awesomeapi.com.br/";
            string path = $"last/{symbol.ToUpper()}-USD";

            HttpClient req = new HttpClient();
            var content = await req.GetAsync(baseURL + path);
            var response = JObject.Parse(await content.Content.ReadAsStringAsync());

            var newExchangeRate = Decimal.Parse(response[$"{symbol}USD"]["bid"].ToString(),CultureInfo.InvariantCulture);
            var dateTimeUpdate = DateTime.Parse(content.Headers.Date.ToString());

            Console.WriteLine("Calling external API: #" + countExternalCalls++);
            return Tuple.Create(newExchangeRate,dateTimeUpdate);
        }
    }
}