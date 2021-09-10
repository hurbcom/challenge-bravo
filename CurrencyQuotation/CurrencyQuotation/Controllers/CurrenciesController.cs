using CurrencyQuotation.Models;
using CurrencyQuotation.Models.Dtos;
using CurrencyQuotation.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace CurrencyQuotation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrenciesController : ControllerBase
    {
        private readonly ILogger<CurrenciesController> _logger;

        private readonly ICurrencyQuotationService _currencyQuotationService;

        public CurrenciesController(ILogger<CurrenciesController> logger, ICurrencyQuotationService quotationService)
        {
            this._currencyQuotationService = quotationService;
            this._logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuotation([FromQuery] string from, string to, decimal amount)
        {
            decimal result = await this._currencyQuotationService.GetQuotation(from, to, amount);
            string jsonResult = JsonSerializer.Serialize(result);

            return Ok(jsonResult);
        }

        [HttpPost]
        public async Task<IActionResult> InsertNewCurrency([FromBody] CurrencyDto currencyDto)
        {
            string successMessage = $"A moeda {currencyDto.Name} foi criada com sucesso";
            string ErrorMessage = $"Erro ao criar a moeda {currencyDto.Name}";

            this._logger.LogInformation($"INIT - InsertNewCurrency - Currency: {currencyDto.Name}, Amount: {currencyDto.Amount}, BaseQuotation: {currencyDto.BaseQuotation}");

            bool success = await this._currencyQuotationService.InsertNewCurrency(currencyDto);

            this._logger.LogInformation($"END - InsertNewCurrency");

            return success ? Ok(successMessage) : BadRequest(ErrorMessage);

        }

        [HttpPut("{name}")]
        public async Task<IActionResult> UpdateCurrency(string name, [FromBody] Currency currency)
        {
            try
            {
                decimal dolarAmount = currency.DolarAmount;
                this._logger.LogInformation($"INIT - UpdateCurrency - Currency: {name}, dolarAmount: {dolarAmount}");

                await this._currencyQuotationService.UpdateCurrencyByName(name, dolarAmount);

                this._logger.LogInformation($"END - UpdateCurrency");

                string successMessage = "Moeda atualizada com sucesso";
                return Ok(successMessage);
            }
            catch (Exception ex)
            {
                string errorMessage = $"Erro ao atualizar a moeda {name}.";
                this._logger.LogError(errorMessage + $" Erro: {ex}");

                return StatusCode(StatusCodes.Status500InternalServerError, errorMessage);
            }
        }

        [HttpDelete("{name}")]
        public IActionResult DeleteCurrency(string name)
        {
            try
            {
                this._logger.LogInformation($"INIT - DeleteCurrency - Currency: {name}");

                this._currencyQuotationService.DeleteCurrencyByName(name);

                this._logger.LogInformation($"END - DeleteCurrency");

                string successMessage = "Moeda deletada com sucesso";
                return Ok(successMessage);
            }
            catch (Exception ex)
            {
                string errorMessage = $"Erro ao deletar a moeda {name}.";
                this._logger.LogError(errorMessage + $" Erro: {ex}");

                return StatusCode(StatusCodes.Status500InternalServerError, errorMessage);
            }
        }
    }
}
