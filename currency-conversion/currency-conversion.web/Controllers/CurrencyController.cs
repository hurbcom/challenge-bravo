using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.web.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace currency_conversion.web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ILogger<CurrencyController> _logger;
        private readonly ICurrencyRepository _currencyRepository;

        public CurrencyController(ILogger<CurrencyController> logger, ICurrencyRepository currencyRepository)
        {
            _logger = logger;
            _currencyRepository = currencyRepository;
        }

        [HttpPost(Name = "insert")]
        public IActionResult Insert([FromBody] CurrencyDTO currency)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        [HttpGet(Name = "get")]
        public IActionResult Get(string code)
        {
            return Ok();
        }

        [HttpPut(Name = "update")]
        public IActionResult Update([FromBody]CurrencyDTO currency)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        [HttpDelete(Name = "delete")]
        public IActionResult Delete(string code)
        {
            return Ok();
        }
    }
}