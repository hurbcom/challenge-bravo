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
        public async Task<ActionResult<decimal>> Get([FromQuery] string from,[FromQuery] string to,[FromQuery] decimal amount)
        {
            var fromCurrency = Currency.GetCached(from);
            var toCurrency = Currency.GetCached(to);

            if (fromCurrency == null)
                return NotFound(from);
            if (toCurrency == null)
                return NotFound(to);

            return await CurrencyConvertService.Convert(fromCurrency, toCurrency, amount);
        }
    }
}