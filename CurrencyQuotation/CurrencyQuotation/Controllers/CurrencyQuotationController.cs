using CurrencyQuotation.Models.Dtos;
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

        [HttpPost]
        [Route("Currency")]
        public IActionResult InsertNewCurrency([FromBody] CurrencyDto currencyDto)
        {
            this._logger.LogInformation($"INIT - InsertNewCurrency - Currency: {currencyDto.Name}, Real Amount: {currencyDto.RealAmount}");

            bool success = this._currencyQuotationService.InsertNewCurrency(currencyDto);

            const string successMessage = "Moeda criada com sucesso";
            const string ErrorMessage = "Erro ao criar a moeda especificada";

            this._logger.LogInformation($"END - InsertNewCurrency");

            return success ? Ok(successMessage) : BadRequest(ErrorMessage);
        }

        [HttpDelete]
        [Route("Currency/{name}")]
        public IActionResult DeleteCurrency(string name)
        {
            this._logger.LogInformation($"INIT - DeleteCurrency - Currency: {name}");

            bool success = this._currencyQuotationService.DeleteCurrencyByName(name);

            const string successMessage = "Moeda deletada com sucesso";
            const string ErrorMessage = "Erro ao deletar a moeda especificada";

            this._logger.LogInformation($"END - DeleteCurrency");

            return success ? Ok(successMessage) : BadRequest(ErrorMessage);
        }
    }
}
