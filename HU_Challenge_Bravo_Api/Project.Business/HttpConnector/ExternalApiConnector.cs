using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Project.Business.DTOs;
using Project.Business.Helpers;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace Project.Business.HttpConnector
{
    /// <summary>
    /// This class has the objective to enable httpclient connection.
    /// </summary>
    public class ExternalApiConnector
    {
        private readonly HttpClient client = null;
        private readonly ServicePoint servicePointManager = null;
        private readonly string route = null;
        private CurrencyDTO currencyData = null;
        private string requestedCurrencySymbol = null;
        
        /// <summary>
        /// This constructor is used to setup the http client instance, set the route from the external API and also 
        /// setup the timeout limite for the connection with the external API.
        /// </summary>
        /// <param name="currencySymbol"></param>
        public ExternalApiConnector(string currencySymbol)
        {
            currencyData = new CurrencyDTO();

            client = new HttpClient();
            client.DefaultRequestHeaders.ConnectionClose = true;

            route = String.Format(@"{0}?convert={1}", CurrencyConversionRoutersHelper.GET_BITCOIN_QUOTATION, currencySymbol);

            servicePointManager = ServicePointManager.FindServicePoint(new Uri(CurrencyConversionRoutersHelper.GET_BITCOIN_QUOTATION));
            servicePointManager.ConnectionLeaseTimeout = 60 * 1000; //1 min

            requestedCurrencySymbol = currencySymbol;
        }

        /// <summary>
        /// This method is used to get the currency data from the external API.
        /// </summary>
        /// <returns></returns>
        public async Task<CurrencyDTO> GetCurrencyQuotation()
        {
            var apiResponseResult = await client.GetStringAsync(route);

            var jsonArray = JArray.Parse(apiResponseResult);

            var serializedJsonObject = JsonConvert.SerializeObject(jsonArray);
            var deserializedJsonObject = JsonConvert.DeserializeObject<List<CurrencyDTO>>(serializedJsonObject);

            foreach (var item in deserializedJsonObject)
            {
                currencyData.Symbol = item.Symbol;
                currencyData.Price_usd = item.Price_usd;
                currencyData.Price_btc = item.Price_btc;
                currencyData.Last_updated = item.Last_updated;
                currencyData.TargetCurrencySymbol = requestedCurrencySymbol;
                currencyData.Price_brl = item.Price_brl;
                currencyData.Price_eur = item.Price_eur;
                currencyData.Price_eth = item.Price_eth;
            }

            return currencyData;
        }
    }
}
