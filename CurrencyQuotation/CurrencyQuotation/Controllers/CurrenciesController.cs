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

        /// <summary>
        ///     Converte o valor de uma moeda para outra
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetQuotation([FromQuery] string from, string to, decimal amount)
        {
            try
            {
                decimal result = await this._currencyQuotationService.GetQuotation(from, to, amount);
                string jsonResult = JsonSerializer.Serialize(result);

                return Ok(jsonResult);
            }
            catch (ArgumentNullException ex)
            {
                this._logger.LogError($" Erro: {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, ex.ParamName);
            }
        }

        /// <summary>
        ///     Insere uma nova moeda a partir de um nome, uma quantia e uma base de cotação.
        ///     Tendo a base como valor default o dolar caso não seja preenchida.
        /// </summary>
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

        /// <summary>
        ///     Atualizar o valor de uma moeda existente na base.
        /// </summary>
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
            catch (ArgumentNullException e)
            {
                this._logger.LogError($" Erro: {e.Message}");

                return NotFound(e.ParamName);
            }
            catch (Exception ex)
            {
                string errorMessage = $"Erro ao atualizar a moeda {name}.";
                this._logger.LogError(errorMessage + $" Erro: {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, errorMessage);
            }
        }

        /// <summary>
        ///     Remove uma moeda existente na base
        /// </summary>
        [HttpDelete("{name}")]
        public async Task<IActionResult> DeleteCurrency(string name)
        {
            try
            {
                this._logger.LogInformation($"INIT - DeleteCurrency - Currency: {name}");

                await this._currencyQuotationService.DeleteCurrencyByName(name);

                this._logger.LogInformation($"END - DeleteCurrency");

                string successMessage = "Moeda deletada com sucesso";
                return Ok(successMessage);
            }
            catch (ArgumentNullException e)
            {
                this._logger.LogError($" Erro: {e.Message}");

                return NotFound(e.ParamName);
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
