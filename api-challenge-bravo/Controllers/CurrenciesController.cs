using System;
using System.Collections.Generic;
using api_challenge_bravo.Model;
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
            return Currency.GetAllCached();
        }

        // GET: api/Currencies/BRL
        [HttpGet("{symbol}")]
        public ActionResult<Currency> Get(string symbol)
        {
            var currency = Currency.GetCached(symbol);

            if (currency == null)
                return NotFound();

            return currency;
        }

        // POST: api/Currencies
        [HttpPost]
        public ActionResult<Currency> Post([FromBody]Currency currency)
        {
            currency.LastTimeUpdatedExchangeRateUTC = currency.LastTimeUpdatedExchangeRateUTC.ToUniversalTime();
            if (currency.LastTimeUpdatedExchangeRateUTC > DateTime.UtcNow || currency.LastTimeUpdatedExchangeRateUTC == DateTime.MinValue)
                return BadRequest(currency.LastTimeUpdatedExchangeRateUTC);

            var existingCurrency = Currency.Get(currency.Symbol);
            if (existingCurrency != null)
                return Conflict(existingCurrency);

            var currencyCreated = new Currency(currency.Symbol, currency.Name, currency.ExchangeRateInUSD,
                currency.AutoUpdateExchangeRate, currency.LastTimeUpdatedExchangeRateUTC);

            return CreatedAtAction(nameof(Get), new {symbol = currency.Symbol}, currencyCreated);

        }

        // DELETE: api/Currencies/BRL
        [HttpDelete("{symbol}")]
        public ActionResult<Currency> Delete(string symbol)
        {
            var currency = Currency.Get(symbol);

            if (currency == null)
                return NotFound();

            Currency.Delete(symbol);

            return Ok();
        }
    }
}
