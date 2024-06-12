using CurrencyConverter.Api.Models;
using CurrencyConverter.Api.Services;
using CurrencyConverter.Core.Models;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Net.Http.Headers;
using System.Text.Json;

namespace CurrencyConverter.Api.Controllers
{
    [ApiController]
    [Route("api/converter")]
    public class CurrencyController : MainController
    {
        private readonly ICurrencyService _currencyService;
        private readonly HttpClient _client;
        private readonly IDatabase _redis;

        public CurrencyController(ICurrencyService currencyService, HttpClient client, IConnectionMultiplexer muxer)
        {
            _currencyService = currencyService;
            _client = client;
            _client.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("weatherCachingApp", "1.0"));
            _redis = muxer.GetDatabase();
        } 

        [HttpGet]
        [Route("from/{from}/to/{to}/amount/{amount}")]
        public async Task<IActionResult> ConvertCurrency(string from, string to, double amount)
        {
            try
            {
                var keyName = $"converter:{from},{to},{amount}";
                var json = _redis.StringGet(keyName);
                var response = new CurrencyConverterResponse();

                if (string.IsNullOrEmpty(json))
                {
                    var convertion = await _currencyService.ConvertCurrency(from, to, amount);
                    response.Result = convertion;
                    json = JsonSerializer.Serialize(response);
                    var setTask = _redis.StringSetAsync(keyName, json);
                    var expireTask = _redis.KeyExpireAsync(keyName, TimeSpan.FromSeconds(3600));
                    await Task.WhenAll(setTask, expireTask);
                }

                response = JsonSerializer.Deserialize<CurrencyConverterResponse>(json);
                return CustomResponse(response);
            }
            catch (Exception ex)
            {
                AddError(ex.Message);
                return CustomResponse();
            }
        }

        [HttpGet]
        public async Task<List<CurrencyViewModel>> Get() =>
            await _currencyService.GetAsync();

        [HttpGet("machine")]
        public IActionResult GetMachine()
        {
            var MachineName = Environment.MachineName;
            return Ok(new { Status = "online", MachineName });
        }

        [HttpPost]
        public async Task<IActionResult> Post(CurrencyViewModel newCurrency)
        {
            if (!ModelState.IsValid)
            {
                return CustomResponse(ModelState);
            }

            var exist = await _currencyService.GetByCodesAsync([newCurrency.Code]);

            if (exist.Count != 0)
            {
                AddError("Currency already exist. Try a new one.");
                return CustomResponse();
            }

            var response = await _currencyService.CreateAsync(newCurrency);

            return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
        }

        [HttpDelete("{code}")]
        public async Task<IActionResult> Delete(string code)
        {
            var currency = await _currencyService.GetByCodesAsync([code]);

            if (currency.Count == 0)
            {
                return NotFound();
            }

            try
            {
                await _currencyService.RemoveAsync(code);

            }
            catch (Exception ex)
            {
                AddError(ex.Message);
                return CustomResponse();
            }

            return NoContent();
        }
    }
}
