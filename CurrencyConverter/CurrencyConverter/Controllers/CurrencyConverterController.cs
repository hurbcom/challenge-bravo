using CurrencyConverter.Model;
using CurrencyConverter.Model.Dto;
using CurrencyConverter.Services;
using Microsoft.AspNetCore.Mvc;
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
            return new OkObjectResult(convertedAmount);
        }

        [HttpGet("getCurrencies")]
        public IActionResult GetCurrencies()
        {
            IEnumerable<Currency> currencies = _currencyService.GetCurrencies();
            return new OkObjectResult(currencies);
        }

        [HttpGet("getCurrenciesById/{currencyId}")]
        public IActionResult GetCurrencyById(long currencyId)
        {
            Currency currency = _currencyService.GetCurrencyById(currencyId);
            return new OkObjectResult(currency);
        }

        [HttpGet("getCurrenciesByName/{currencyName}")]
        public IActionResult GetCurrencyById(string currencyName)
        {
            Currency currency = _currencyService.GetCurrencyByName(currencyName);
            return new OkObjectResult(currency);
        }

        [HttpPost("{currencyName}")]
        public async Task<IActionResult> InsertCurrency(string currencyName)
        {
            string message = await _currencyService.InsertCurrency(currencyName);
            return new OkObjectResult(message);
        }

        [HttpDelete("{currencyName}")]
        public IActionResult DeleteCurrency(string currencyName)
        {
            _currencyService.DeleteCurrency(currencyName);
            return new OkResult();
        }
    }
}
