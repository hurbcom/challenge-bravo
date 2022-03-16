using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api_challenge_bravo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api_challenge_bravo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrenciesConvertController : ControllerBase
    {
        // GET: api/CurrenciesConvert
        [HttpGet]
        public ActionResult<decimal> Get([FromQuery] string fromSymbol,[FromQuery] string toSymbol,[FromQuery] decimal amount)
        {
            return CurrencyConvertService.Convert(fromSymbol, toSymbol, amount);
        }
    }
}