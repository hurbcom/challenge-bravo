using currency_conversion.Core.Interfaces.Repositories;
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

        [HttpGet(Name = "")]
        public OkResult Get()
        {
            return Ok();
        }
    }
}