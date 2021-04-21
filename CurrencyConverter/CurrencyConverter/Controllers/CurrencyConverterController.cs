using CurrencyConverter.Model;
using CurrencyConverter.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Transactions;

namespace CurrencyConverter.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyConverterController : ControllerBase
    {
        private readonly ICurrencyRepository _currencyRepository;

        public CurrencyConverterController(ICurrencyRepository currencyRepository)
        {
            _currencyRepository = currencyRepository;
        }

        [HttpGet]
        public IActionResult GetCurrencies()
        {
            IEnumerable<Currency> currencies = _currencyRepository.GetCurrencies();
            return new OkObjectResult(currencies);
        }

        [HttpGet("{id}")]
        public IActionResult GetCurrencyById(long currencyId)
        {
            Currency currency = _currencyRepository.GetCurrencyById(currencyId);
            return new OkObjectResult(currency);
        }

        [HttpPost]
        public IActionResult InsertCurrency([FromBody] Currency currency)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                _currencyRepository.InsertCurrency(currency);
                scope.Complete();
                return CreatedAtAction(nameof(GetCurrencyById), new { id = currency.Id }, currency);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCurrency(long currencyId)
        {
            _currencyRepository.DeleteCurrency(currencyId);
            return new OkResult();
        }
    }
}
