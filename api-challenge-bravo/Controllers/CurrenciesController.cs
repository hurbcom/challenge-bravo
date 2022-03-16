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
        public IEnumerable<Currency> Get()
        {
            return Currency.GetAll();
        }

        // GET: api/Currencies/BRL
        [HttpGet("{symbol}")]
        public Currency Get(string symbol)
        {
            return Currency.Get(symbol);
        }

        // POST: api/Currencies
        [HttpPost]
        public void Post([FromBody]Currency currency)
        {
            new Currency(currency.Symbol, currency.Name, currency.ExchangeRateInUSD, currency.AutoUpdateExchangeRate);
        }

        // DELETE: api/Currencies/BRL
        [HttpDelete("{symbol}")]
        public void Delete(string symbol)
        {
            Currency.Delete(symbol);
        }
    }
}
