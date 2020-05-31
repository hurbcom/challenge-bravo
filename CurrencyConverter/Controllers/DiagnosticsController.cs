using CurrencyConverter.API;
using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using Hangfire;
using Hangfire.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

namespace currencyConverter.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DiagnosticsController : ControllerBase
    {
        private readonly ILogger<DiagnosticsController> _logger;
        private readonly IDistributedCache _cache;
        private readonly ICryptoComparer _cryptoComparer;
        private readonly IRepositoryBase<Configuration> _repo;
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