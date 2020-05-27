using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrastructure;
using CurrencyConverter.Service.Interfaces;
using CurrencyConverter.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CurrencyConverter.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ILogger<CurrencyController> _logger;
        private ICurrencySrv _currencySrv;

        public CurrencyController(ILogger<CurrencyController> logger, ICurrencySrv currencySrv)
        {
            _logger = logger;
            _currencySrv = currencySrv;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var i = _currencySrv.GetAll();

            _logger.LogInformation($"User called currency");
            return new OkObjectResult(i);
        }
    }
}
