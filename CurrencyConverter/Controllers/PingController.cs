using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CurrencyConverter.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace currencyConverter.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PingController : ControllerBase
    {
        private readonly ILogger<PingController> _logger;

        public PingController(ILogger<PingController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<object> Get()
        {
            string d = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
            var cli = new HttpClient();
            var market = cli.GetAsync("https://api.exchangeratesapi.io/latest?base=USD").Result;
            var cryto = cli.GetAsync("https://api.bitaps.com/market/v1/ticker/btcusd").Result;

            object ping = new
            {
                Date = d,
                Msg = "I'm alive",
                MarketPing = market.IsSuccessStatusCode,
                CryptoPing = cryto.IsSuccessStatusCode,
            };

            _logger.LogInformation($"User called ping at {d}");
            return ping;
        }
    }
}
