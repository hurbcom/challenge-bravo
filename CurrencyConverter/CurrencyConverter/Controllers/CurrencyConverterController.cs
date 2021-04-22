using CurrencyConverter.Model;
using CurrencyConverter.Model.Dto;
using CurrencyConverter.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

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
        public IActionResult GetCurrencies()
        {
            IEnumerable<Currency> currencies = _currencyService.GetCurrencies();
            return new OkObjectResult(currencies);
        }

        [HttpGet("{currencyId}")]
        public IActionResult GetCurrencyById(long currencyId)
        {
            Currency currency = _currencyService.GetCurrencyById(currencyId);
            return new OkObjectResult(currency);
        }

        [HttpPost]
        public IActionResult InsertCurrency([FromBody] Currency currency)
        {
            _currencyService.InsertCurrency(currency);
            return CreatedAtAction(nameof(GetCurrencyById), new { id = currency.Id }, currency);
        }

        [HttpDelete("{currencyName}")]
        public IActionResult DeleteCurrency(string currencyName)
        {
            _currencyService.DeleteCurrency(currencyName);
            return new OkResult();
        }
    }
}
