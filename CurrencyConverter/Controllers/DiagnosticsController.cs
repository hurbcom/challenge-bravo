using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Infrastructure;
using Hangfire;
using Hangfire.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

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
        
        public DiagnosticsController(ILogger<DiagnosticsController> logger, ICryptoComparer cryptoComparer, IDistributedCache cache, IRepositoryBase<Configuration> repo)
        {
            _logger = logger;
            _cache = cache;
            _cryptoComparer = cryptoComparer;
            _repo = repo;
        }
        
        [HttpGet]
        public ActionResult<object> Get()
        {
            string d = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
            IMonitoringApi monitoringApi = JobStorage.Current.GetMonitoringApi();

            bool externalConnection = false;            
            try
            {
                var rate = _cryptoComparer.GetLastestRate("BRL");
                if (rate > 0)
                {
                    externalConnection = true;
                }
            }
            catch (Exception)
            { }

            bool cacheCheck = false;
            try
            {
                _cache.SetString("beat", "true");
                cacheCheck = bool.Parse(_cache.GetString("beat"));
            }
            catch (Exception)
            { }

            bool dbCheck = false;
            try
            {
                dbCheck = _repo.GetAll<Configuration>().ToList().Any();
            }
            catch(Exception)
            {  }

            object ping = new
            {
                System = "Is system fully alive?",
                Date = d,
                external_integration = externalConnection,
                Background_worker = monitoringApi.Servers().Any(),
                cache_server = cacheCheck,
                database = dbCheck
            };

            _logger.LogInformation($"User called ping at {d}");
            return ping;
        }
    }
}