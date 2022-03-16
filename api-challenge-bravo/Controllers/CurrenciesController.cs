using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api_challenge_bravo.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api_challenge_bravo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrenciesController : ControllerBase
    {
        // GET: api/Currencies
        [HttpGet]
        public ActionResult<IEnumerable<Currency>> Get()
        {
            return Currency.GetAll();
        }

        // GET: api/Currencies/BRL
        [HttpGet("{symbol}")]
        public ActionResult<Currency> Get(string symbol)
        {
            var currency = Currency.Get(symbol);

            if(currency == null)
                return NotFound();

            return currency;
        }

        // POST: api/Currencies
        [HttpPost]
        public ActionResult<Currency> Post([FromBody]Currency currency)
        {
            var existingCurrency = Currency.Get(currency.Symbol);
            if (existingCurrency != null)
                return Conflict(existingCurrency);

            new Currency(currency.Symbol, currency.Name, currency.ExchangeRateInUSD, currency.AutoUpdateExchangeRate);

            return CreatedAtAction(nameof(Get), new { symbol = currency.Symbol }, currency);
        }

        // DELETE: api/Currencies/BRL
        [HttpDelete("{symbol}")]
        public ActionResult<Currency> Delete(string symbol)
        {
            var currency = Currency.Get(symbol);

            if(currency == null)
                return NotFound();

            Currency.Delete(symbol);

            return Ok();
        }
    }
}
