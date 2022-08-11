using CurrencyConverterAPI.Configuration;
using CurrencyConverterAPI.CrossCutting.HandlerErrorMessage;
using CurrencyConverterAPI.CrossCutting.Log;
using CurrencyConverterAPI.Domain.Models;
using CurrencyConverterAPI.Repositories;
using CurrencyConverterAPI.Services;
using Newtonsoft.Json.Linq;
using StackExchange.Redis;
using System.Globalization;
using System.Net;
using System.Text.Json;

namespace CurrencyConverterAPI.Application.AppServices.Implementation
{
    public class ExchangeAppService : IExchangeAppService
    {
        private readonly IApiConfiguration _config;
        private readonly IExchangeService _exchangeService;
        private readonly ICoinRepository _coinRepository;
        private readonly ILogger<ExchangeAppService> _logger;
        private readonly IConnectionMultiplexer _redis;
        private static IDatabase _cache;
        private readonly TimeSpan _timeoutCache = TimeSpan.FromHours(1);

        public ExchangeAppService(IApiConfiguration config,
                                  IExchangeService exchangeService,
                                  ICoinRepository coinRepository,
                                  ILogger<ExchangeAppService> logger,
                                  IConnectionMultiplexer redis)
        {
            _exchangeService = exchangeService;
            _coinRepository = coinRepository;
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
                    Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetExchange", "Key in the cache.");
                    prices[i] = GetPriceInCache(keys[i]);
                }
                else if (_coinRepository.IsExistCoinByAcronym(keys[i]).Result)
                {
                    Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetExchange", "Key in the database.");
                    prices[i] = _coinRepository.GetPriceCoinByAcronym(keys[i]).Result;
                }
                else
                {
                    Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetExchange", "Call API Coinbase.");

                    IDictionary<string, object> response = await GetExchangeRates();
                    JObject result = (JObject)response["rates"];

                    if (!IsHasKeyInApi(result, keys[i]))
                        return new Error((int)HttpStatusCode.NotFound, HandlerErrorResponseMessage.NotFoundCoinNotAvailable(keys[i]));

                    SaveRatesApiInCache(result);
                    SaveAcronymApiInCache(result.Properties().Select(x => x.Name).ToList());

                    prices[i] = GetValueInApi(result, keys[i]);
                }
            }

            decimal priceFrom = CalculatesValueCurrencyBallast(prices[0]);
            decimal priceTo = prices[1];
            decimal amountConverted = CalculateConversion(priceFrom, priceTo, amount);

            return new CoinConverted(from, to, amount, amountConverted);
        }

        async Task<IEnumerable<string>> IExchangeAppService.GetAcronymCoins()
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetAcronymCoins", "Key in the cache.");

            if (IsHasKeyInCache("acronymCoins"))
                return GetListAcronymsInCache("acronymCoins");

            var response = await GetExchangeRates();
            JObject result = (JObject)response["rates"];
            SaveAcronymApiInCache(result.Properties().Select(x => x.Name).ToList());
            SaveRatesApiInCache(result);

            var listAcronyms = result.Properties().Select(x => x.Name).ToList();

            return listAcronyms;
        }

        async Task<bool> IExchangeAppService.IsExistAcronymInCache(string acronym)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "IsExistAcronymInCache");
            return IsHasKeyInCache(acronym);
        }

        async Task<bool> IExchangeAppService.AcronymIsExistInAPI(string acronym)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "AcronymIsExistInAPI");
            var response = await GetExchangeRates();
            JObject result = (JObject)response["rates"];
            SaveAcronymApiInCache(result.Properties().Select(x => x.Name).ToList());
            SaveRatesApiInCache(result);
            return IsHasKeyInApi(result, acronym);
        }

        #region Private Methods for Cache
        private static bool IsHasKeyInCache(string key)
        {
            return _cache.KeyExistsAsync(key).Result;
        }

        private static decimal GetPriceInCache(string key)
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
                _cache.StringSet(key, value, _timeoutCache);
            }
        }

        private IEnumerable<string> GetListAcronymsInCache(string key)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetListAcronymsInCache", "Save acronyms in cache.");
            var list = _cache.StringGetAsync(key).Result;
            return JsonSerializer.Deserialize<IEnumerable<string>>(list);
        }

        private void SaveAcronymApiInCache(List<string> acronymCoins)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "SaveAcronymApiInCache", "Save rate in cache.");
            _cache.StringSet("acronymCoins", JsonSerializer.Serialize(acronymCoins), _timeoutCache);
        }
        #endregion

        #region Private Methods for API
        private async Task<IDictionary<string, object>> GetExchangeRates()
        {
            return await _exchangeService.GetExchangeRates();
        }

        private bool IsHasKeyInApi(JObject result, string key)
        {
            return result.ContainsKey(key);
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
        public static decimal CalculatesValueCurrencyBallast(decimal priceFrom)
        {
            return 1 / priceFrom;
        }

        public static decimal CalculateConversion(decimal priceFrom, decimal priceTo, decimal amount)
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
