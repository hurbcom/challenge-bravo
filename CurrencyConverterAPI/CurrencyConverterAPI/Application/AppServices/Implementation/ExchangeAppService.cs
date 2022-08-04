using CurrencyConverterAPI.Configuration;
using CurrencyConverterAPI.CrossCutting.HandlerErrorMessage;
using CurrencyConverterAPI.Domain.Models;
using CurrencyConverterAPI.Services;
using Newtonsoft.Json.Linq;
using System.Globalization;
using System.Net;

namespace CurrencyConverterAPI.Application.AppServices.Implementation
{
    public class ExchangeAppService : IExchangeAppService
    {
        private readonly IApiConfiguration _config;
        private readonly IExchangeService _exchangeService;
        private readonly ILogger<ExchangeAppService> _logger;

        public ExchangeAppService(IApiConfiguration config, IExchangeService exchangeService, ILogger<ExchangeAppService> logger)
        {
            _exchangeService = exchangeService;
            _logger = logger;
            _config = config;
        }

        async Task<CurrencyConvertedResponse> IExchangeAppService.GetExchange(string from, string to, decimal amount)
        {
            IDictionary<string, object> response = await _exchangeService.GetExchangeRates();
            JObject result = (JObject)response["rates"];

            if (!result.HasValues)
                return new CurrencyConvertedResponse((int)HttpStatusCode.BadRequest, new Error(HandlerErrorResponseMessage.Exception));

            if (response["status_code"] is not HttpStatusCode.OK)
                return new CurrencyConvertedResponse((int)HttpStatusCode.BadRequest, new Error(HandlerErrorResponseMessage.Exception));
            else
            {
                if (!result.ContainsKey(from))
                    return new CurrencyConvertedResponse((int)HttpStatusCode.NotFound, new Error(HandlerErrorResponseMessage.NotFoundCurrencyUnavailable(from)));
                if (!result.ContainsKey(to))
                    return new CurrencyConvertedResponse((int)HttpStatusCode.NotFound, new Error(HandlerErrorResponseMessage.NotFoundCurrencyUnavailable(to)));

                decimal priceFrom = CalculatesValueCurrencyBallast(result[from].Value<decimal>());
                decimal priceTo = result[to].Value<decimal>();
                decimal amountConverted = CalculateConversion(priceFrom, priceTo, amount);

                var currencyConverted = new CurrencyConverted(from, to, amount, amountConverted);
                return new CurrencyConvertedResponse((int)HttpStatusCode.OK, null, currencyConverted);
            }
        }

        /// <summary>
        /// Calculates the value of the Currency-Ballast pair
        /// Example: Ballast is USD
        ///          priceFrom is value of the pair USD-BRL
        ///          The value of the BRL-USD pair is calculated by dividing '1 / input parameter ' 
        /// </summary>
        /// <param name="priceFrom">'from' is price of the pair Ballast-Currency. Example: USD 1  = R$5.3890, where from is 5.3890</param>
        /// <returns>Price for pair Currency-Ballast</returns>
        private static decimal CalculatesValueCurrencyBallast(decimal priceFrom)
        {
            return 1 / priceFrom;
        }

        private static decimal CalculateConversion(decimal priceFrom, decimal priceTo, decimal amount)
        {
            return Math.Round(priceFrom * priceTo * amount, 5);
        }

        private static void SaveRatesInCache(JObject result)
        {
            foreach (JProperty property in result.Properties())
            {
                string key = property.Name;
                decimal value = decimal.Parse(property.Value.ToString(), CultureInfo.InvariantCulture);
                //TODO: Implementar logica de salvar no cache
            }
        }

    }
}
