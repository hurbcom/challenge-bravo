using CurrencyConverter.Model;
using CurrencyConverter.Model.Dto;
using CurrencyConverter.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CurrencyConverter.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyConverterController : ControllerBase
    {
        private readonly ICurrencyService _currencyService;

        public CurrencyConverterController(ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        [HttpGet]
        public IActionResult ConvertAmountToCurrency([FromQuery] string from, string to, decimal amount)
        {
            CurrencyToConvertDto currencyToConvertDto = new CurrencyToConvertDto(from, to, amount);
            decimal convertedAmount = _currencyService.ConvertAmountToCurrency(currencyToConvertDto);
            string jsonAnswer = JsonConvert.SerializeObject(convertedAmount);
            return new OkObjectResult(jsonAnswer);
        }

        [HttpGet("getCurrencies")]
        public IActionResult GetCurrencies()
        {
            IEnumerable<Currency> currencies = _currencyService.GetCurrencies();
            string jsonAnswer = JsonConvert.SerializeObject(currencies);
            return new OkObjectResult(jsonAnswer);
        }

        [HttpGet("getCurrenciesById/{currencyId}")]
        public IActionResult GetCurrencyById(long currencyId)
        {
            Currency currency = _currencyService.GetCurrencyById(currencyId);
            string jsonAnswer = JsonConvert.SerializeObject(currency);
            return new OkObjectResult(jsonAnswer);
        }

        [HttpGet("getCurrenciesByName/{currencyName}")]
        public IActionResult GetCurrencyByName(string currencyName)
        {
            Currency currency = _currencyService.GetCurrencyByName(currencyName);
            string jsonAnswer = JsonConvert.SerializeObject(currency);
            return new OkObjectResult(jsonAnswer);
        }

        [HttpPost("{currencyName}")]
        public async Task<IActionResult> InsertCurrency(string currencyName)
        {
            string message = await _currencyService.InsertCurrency(currencyName);
            string jsonAnswer = JsonConvert.SerializeObject(message);
            return new OkObjectResult(jsonAnswer);
        }

        [HttpDelete("{currencyName}")]
        public IActionResult DeleteCurrency(string currencyName)
        {
            _currencyService.DeleteCurrency(currencyName);
            return new OkResult();
        }
    }
}
