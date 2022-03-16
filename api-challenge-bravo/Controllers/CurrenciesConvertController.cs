using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api_challenge_bravo.Model;
using api_challenge_bravo.Services;
using Microsoft.AspNetCore.Http;
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
            if (Currency.Get(from) == null)
                return NotFound(from);
            if (Currency.Get(to) == null)
                return NotFound(to);

            return await CurrencyConvertService.Convert(from, to, amount);
        }
    }
}