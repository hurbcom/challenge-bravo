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
        public IActionResult GetAllCurrencies()
        {
            try
            {
                var allItems = _currencySrv.GetAll();
                _logger.LogInformation($"Called GetAllCurrencies returned {allItems.ToList().Count}");
                return new OkObjectResult(allItems);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called GetAllCurrencies returned error: {ex.Message}");
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
                _logger.LogInformation($"Called CreateCurrency returned {Item}");
                return new OkObjectResult(currency);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called CreateCurrency returned error: {ex.Message}");
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        ///Get currency by Id
        /// </summary>
        /// <param name="id">Entity Id</param>
        [HttpGet("{id}", Name = "GetCurrencyById")]
        public IActionResult GetCurrencyById(int id)
        {
            try
            {
                var item = _currencySrv.GetById(id);
                _logger.LogInformation($"Called GetCurrencyById returned {item}");
                return new OkObjectResult(item);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called GetCurrencyById returned error: {ex.Message}");
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        ///Update currency information
        /// </summary>
        /// <param name="currency">Entiy to update</param>
        [HttpPut]
        public IActionResult UpdateCurrency([FromBody]Currency currency)
        {
            try
            {
                var resul = _currencySrv.UpdateCurrency(currency);
                _logger.LogInformation($"Called UpdateCurrency returned {resul}");
                var item = _currencySrv.GetById(currency.id);
                return new OkObjectResult(item);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called UpdateCurrency returned error: {ex.Message}");
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        ///Delete currency information
        /// </summary>
        /// <param name="currency">Entiy to delete</param>
        [HttpDelete]
        public IActionResult DeleteCurrency([FromBody]Currency currency)
        {
            try
            {
                var resul = _currencySrv.DeleteCurrency(currency);
                _logger.LogInformation($"Called DeleteCurrency returned {resul}");
                var item = _currencySrv.GetById(currency.id);
                return new OkObjectResult(item);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called DeleteCurrency returned error: {ex.Message}");
                throw new Exception(ex.Message);
            }
        }
    }
}
