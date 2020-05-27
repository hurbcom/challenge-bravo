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

        /// <summary>
        ///Get all currencies registered
        /// </summary>
        [HttpGet(Name = "GetCurrencies")]
        public IActionResult GetAll()
        {
            try
            {
                var allItems = _currencySrv.GetAll();
                _logger.LogInformation($"Called GetAll currency returned {allItems.ToList().Count}");
                return new OkObjectResult(allItems);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called GetAll currency returned error: {ex.Message}");
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        ///Add new currency
        /// </summary>
        /// /// <param name="currency">Entity</param>
        [HttpPost]
        public IActionResult CreateCurrency([FromBody] Currency currency)
        {
            try
            {
                var Item = _currencySrv.AddCurrency(currency);
                _logger.LogInformation($"Called Create currency returned {Item}");
                return new OkObjectResult(currency);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called Create currency returned error: {ex.Message}");
                throw new Exception(ex.Message);
            }
        }
    }
}
