using System;
using System.Threading.Tasks;
using api_challenge_bravo.Model;
using api_challenge_bravo.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_challenge_bravo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrenciesConvertController : ControllerBase
    {
        // GET: api/CurrenciesConvert?from=BTC&to=EUR&amount=123.45
        [HttpGet]
        public async Task<ActionResult> Get([FromQuery] string from,[FromQuery] string to,[FromQuery] decimal amount)
        {
            var fromCurrency = Currency.GetCached(from);
            var toCurrency = Currency.GetCached(to);

            if (fromCurrency == null)
                return NotFound(from);
            if (toCurrency == null)
                return NotFound(to);

            if (toCurrency.ExchangeRateInUSD == 0)
                return DivideByZeroReturn(fromCurrency.Symbol);

            decimal resulAmount;
            DateTime resultLastUpdate;

            (resulAmount,resultLastUpdate) = await CurrencyConvertService.Convert(fromCurrency, toCurrency, amount);
            var jsonReturn = new
            {
                currency = fromCurrency.Symbol,
                amount = Math.Round(resulAmount, 4),
                last_update = resultLastUpdate
            };

            return new JsonResult(jsonReturn);
        }

        private JsonResult DivideByZeroReturn(string fromSymbol)
        {
            var jsonReturn = new
            {
                currency = fromSymbol,
                amount = 0,
                last_update = DateTime.Now
            };

            return new JsonResult(jsonReturn);
        }
    }
}