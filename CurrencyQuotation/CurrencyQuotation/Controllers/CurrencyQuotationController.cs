using CurrencyQuotation.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace CurrencyQuotation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyQuotationController : ControllerBase
    {
        private readonly ILogger<CurrencyQuotationController> _logger;

        private readonly ICurrencyQuotationService _currencyQuotationService;

        public CurrencyQuotationController(ILogger<CurrencyQuotationController> logger, ICurrencyQuotationService quotationService)
        {
            this._currencyQuotationService = quotationService;
            this._logger = logger;
        }

        [HttpGet]
        public IActionResult GetQuotation([FromQuery] string from, string to, decimal amount)
        {
            this._logger.LogInformation($"INIT - GetQuotation - From: {from}, To: {to} e Amount: {amount}");

            decimal result = this._currencyQuotationService.GetQuotation(from, to, amount);
            string jsonResult = JsonSerializer.Serialize(result);

            this._logger.LogInformation($"END - GetQuotation");

            return Ok(jsonResult);
        }
    }
}
