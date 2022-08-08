using CurrencyConverterAPI.Configuration;
using CurrencyConverterAPI.CrossCutting.HandlerErrorMessage;
using CurrencyConverterAPI.CrossCutting.Log;
using CurrencyConverterAPI.Domain.Models;
using CurrencyConverterAPI.Services;
using Newtonsoft.Json.Linq;
using StackExchange.Redis;
using System.Globalization;
using System.Net;

namespace CurrencyConverterAPI.Application.AppServices.Implementation
{
    public class ExchangeAppService : IExchangeAppService
    {
        private readonly IApiConfiguration _config;
        private readonly IExchangeService _exchangeService;
        private readonly ILogger<ExchangeAppService> _logger;
        private readonly IConnectionMultiplexer _redis;
        private static IDatabase _cache;

        public ExchangeAppService(IApiConfiguration config,
                                  IExchangeService exchangeService,
                                  ILogger<ExchangeAppService> logger,
                                  IConnectionMultiplexer redis)
        {
            _exchangeService = exchangeService;
            _logger = logger;
            _config = config;
            _redis = redis;
            _cache = _redis.GetDatabase();

        }

        async Task<dynamic> IExchangeAppService.GetExchange(string from, string to, decimal amount)
        {
            string[] keys = new string[2] { from, to };
            decimal[] prices = new decimal[2];

            for (int i = 0; i < prices.Length; i++)
            {
                if (IsHasKeyInCache(keys[i]))
                {
                    Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetExchange", "Key in the cache");
                    prices[i] = GetValueInCache(keys[i]);
                }
                else
                {
                    Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetExchange", "Call API Coinbase.");

                    IDictionary<string, object> response = await GetExchangeRates();

                    if (IsApiReturnedIsNOK((HttpStatusCode)response["status_code"]))
                        return new Error((int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.Exception);

                    JObject result = (JObject)response["rates"];
                    if (!result.HasValues)
                        return new Error((int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.Exception);

                    if (!IsHasKeyInApi(result, keys[i]))
                        return new Error((int)HttpStatusCode.NotFound, HandlerErrorResponseMessage.NotFoundCurrencyUnavailable(keys[i]));

                    SaveRatesApiInCache(result);

                    prices[i] = GetValueInApi(result, keys[i]);
                    _logger.LogInformation(String.Format("Valor {0} da posição {1}", prices[i], i));
                }
            }

            decimal priceFrom = CalculatesValueCurrencyBallast(prices[0]);
            decimal priceTo = prices[1];
            decimal amountConverted = CalculateConversion(priceFrom, priceTo, amount);

            return new CurrencyConverted(from, to, amount, amountConverted);
        }

        #region Private Methods for Cache
        private static bool IsHasKeyInCache(string key)
        {
            return _cache.KeyExistsAsync(key).Result;
        }

        private static decimal GetValueInCache(string key)
        {
            return decimal.Parse(_cache.StringGetAsync(key).Result, CultureInfo.InvariantCulture);
        }

        private void SaveRatesApiInCache(JObject result)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "SaveRatesApiInCache", "Save rate in cache.");
            foreach (JProperty property in result.Properties())
            {
                string key = property.Name;
                string value = property.Value.ToString();
                _cache.StringSet(key, value, TimeSpan.FromHours(1));
            }
        }
        #endregion

        #region Private Methods for API
        private async Task<IDictionary<string, object>> GetExchangeRates()
        {
            return await _exchangeService.GetExchangeRates();
        }

        private static bool IsHasKeyInApi(JObject result, string key)
        {
            return result.ContainsKey(key);
        }

        private static bool IsApiReturnedIsNOK(HttpStatusCode statusCodeRsponse)
        {
            return statusCodeRsponse is not HttpStatusCode.OK;
        }

        private static decimal GetValueInApi(JObject result, string key)
        {
            return result[key].Value<decimal>();
        }
        #endregion

        #region Private Methods Calculate
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
            return Math.Round(priceFrom * priceTo * amount, 4);
        }
        #endregion

        #region Call for test Resilience
        Task IExchangeAppService.GetTestPolly(int code)
        {
            return _exchangeService.GetTestPolly(code);
        }
        #endregion
    }
}
