using AutoMapper;
using CurrencyConverter.API.DTO;
using CurrencyConverter.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CurrencyConverter.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ILogger<CurrencyController> _logger;
        private readonly ICurrencySrvc _currencySrv;
        private readonly IPriceSrvc _priceSrvc;
        private readonly IMapper _m;

        public CurrencyController(ILogger<CurrencyController> logger, ICurrencySrvc currencySrv, IPriceSrvc priceSrvc, IMapper m)
        {
            _logger = logger;
            _currencySrv = currencySrv;
            _priceSrvc = priceSrvc;
            _m = m;
        }

        /// <summary>
        ///Get all currencies registered
        /// </summary>
        [HttpGet("/Converter")]
        public IActionResult Converter([FromQuery] string from = "", [FromQuery] string to = "", [FromQuery] float amount = 0)
        {
            try
            {
                //Logger removed to maximize performance
                if (from.Any() && to.Any() && amount > 0)
                {
                    var result = _priceSrvc.Convert(from, to, amount);
                    return new OkObjectResult(result);
                }
                else
                {
                    return new BadRequestObjectResult(new { Error = "Verify if these currencies exists and amount is positive" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called Converter returned error: {ex.Message}");
                return new BadRequestObjectResult(new { Error = "Currency not found" });
            }
        }

        /// <summary>
        ///Get all active currencies registered
        /// </summary>
        [HttpGet(Name = "GetCurrencies")]
        public IActionResult GetAllCurrencies()
        {
            try
            {
                var allItems = _currencySrv.GetAllActive().ToList();
                var allItemsResponse = _m.Map<List<CurrencyResponse>>(allItems);
                _logger.LogInformation($"Called GetAllCurrencies returned {allItems.ToList().Count} active items");
                return new OkObjectResult(allItemsResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called GetAllCurrencies returned error: {ex.Message}");
                return new BadRequestObjectResult(new { Error = "System was not able to process your request" });
            }
        }

        /// <summary>
        ///Add new currency
        /// </summary>
        /// /// <param name="currency">Entity</param>
        [HttpPost]
        public IActionResult CreateCurrency([FromBody] string currencyName)
        {
            try
            {
                var Item = _currencySrv.AddCurrency(currencyName);
                var createdCurrency = _m.Map<CurrencyResponse>(Item);
                _logger.LogInformation($"Called CreateCurrency returned id {Item}");
                return new OkObjectResult(createdCurrency);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Called CreateCurrency returned error: {ex.Message}");
                return new BadRequestObjectResult(new { Error = "System was not able to process your request" });
            }
        }

        /// <summary>
        ///Delete currency information
        /// </summary>
        /// <param name="id">Entity Id</param>
        [HttpDelete]
        public IActionResult DeleteCurrency([FromBody] string currencyName)
        {
            try
            {
                var resul = _currencySrv.DeleteCurrency(currencyName);
                _logger.LogInformation($"Called DeleteCurrency for {currencyName} returned {resul}");
                if (resul)
                {
                    return new OkObjectResult(resul);
                }
                else
                {
                    return new NotFoundObjectResult(currencyName);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError($"Called DeleteCurrency returned error: {ex.Message}");
                return new BadRequestObjectResult(new { Error = "System was not able to process your request" });
            }
        }
    }
}
