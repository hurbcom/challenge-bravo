using System;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml.Linq;
using Newtonsoft.Json.Linq;

namespace api_challenge_bravo.Services.Util.ExternalCurrencyAPI
{
    public class AwesomeAPI : IExternalCurrencyAPI
    {
        private static int _countExternalCalls = 1;
        private string baseURL = "https://economia.awesomeapi.com.br/";

        public async Task<Tuple<decimal,DateTime>> GetExchangeRate(string symbol)
        {
            string path = $"last/{symbol.ToUpper()}-USD";

            HttpClient req = new HttpClient();
            var content = await req.GetAsync(baseURL + path);
            var response = JObject.Parse(await content.Content.ReadAsStringAsync());

            var newExchangeRate = Decimal.Parse(response[$"{symbol}USD"]["bid"].ToString(),CultureInfo.InvariantCulture);
            var dateTimeUpdate = DateTime.Parse(content.Headers.Date.ToString());

            Console.WriteLine("LOG: Calling external API: #" + _countExternalCalls++);
            return Tuple.Create(newExchangeRate,dateTimeUpdate);
        }
        public bool CheckAvailabilityOfAutoUpdater(string symbol)
        {
            string path = "xml/available";

            var availabilityListXML = XDocument.Load(baseURL+path);
            var availabilitySymbol =
                (from element in availabilityListXML.Descendants($"{symbol}-USD") select element.Name).FirstOrDefault();

            return availabilitySymbol != null;
        }
    }
}