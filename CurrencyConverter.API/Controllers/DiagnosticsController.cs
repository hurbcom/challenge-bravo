using CurrencyConverter.API;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;

namespace currencyConverter.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DiagnosticsController : ControllerBase
    {
        private readonly ILogger<DiagnosticsController> _logger;
        private readonly IDiagnostics _diagnostics;

        public DiagnosticsController(ILogger<DiagnosticsController> logger, IDiagnostics diagnostics)
        {
            _logger = logger;
            _diagnostics = diagnostics;
        }

        [HttpGet]
        public ActionResult<object> Get()
        {
            string d = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
            object ping = new
            {
                System = "Is system fully alive?",
                Swagger = "/swagger",
                Date = d,
                external_integration = _diagnostics.ExternalConnection(),
                Background_worker = _diagnostics.BackgroundWorkers(),
                cache_server = _diagnostics.CacheServer(),
                database = _diagnostics.Database()
            };

            _logger.LogInformation($"User called diagnostics at {d}");
            return ping;
        }
    }
}