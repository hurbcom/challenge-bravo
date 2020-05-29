using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Infrastructure;
using Hangfire;
using Hangfire.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace currencyConverter.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PingController : ControllerBase
    {
        private readonly ILogger<PingController> _logger;
        public ICryptoComparer CryptoComparer { get; }
        
        public PingController(ILogger<PingController> logger, ICryptoComparer cryptoComparer)
        {
            _logger = logger;
            CryptoComparer = cryptoComparer;
        }
        
        [HttpGet]
        public ActionResult<object> Get()
        {
            string d = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
            var rate = CryptoComparer.GetLastestRate("BRL");
            IMonitoringApi monitoringApi = JobStorage.Current.GetMonitoringApi();

            object ping = new
            {
                Date = d,
                Msg = "I'm alive",
                Brl_rate = rate,
                Background_worker = monitoringApi.Servers().Any()
            };

            _logger.LogInformation($"User called ping at {d}");
            return ping;
        }
    }
}