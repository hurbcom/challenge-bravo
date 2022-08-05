using CurrencyConverterAPI.Application.AppServices;
using CurrencyConverterAPI.CrossCutting.HandlerErrorMessage;
using CurrencyConverterAPI.CrossCutting.Log;
using CurrencyConverterAPI.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Polly.CircuitBreaker;
using System.Globalization;
using System.Net;

namespace CurrencyConverterAPI.Controllers
{
    [ApiVersion("1")]
    [ApiController]
    [Route("api/[controller]/v{version:apiVersion}")]
    public class CurrencyController : ControllerBase
    {
        private readonly ILogger<CurrencyController> _logger;
        private readonly IExchangeAppService _exchangeAppService;

        public CurrencyController(ILogger<CurrencyController> logger, IExchangeAppService exchangeAppService)
        {
            _logger = logger;
            _exchangeAppService = exchangeAppService;
        }

        /// <summary>
        /// Convert between fiat, crypto and fictitious currencies
        /// </summary>
        /// <param name="from">source currency</param>
        /// <param name="to">Final currency</param>
        /// <param name="amount">Value to be converted</param>
        /// <returns>Converted value</returns>
        [HttpGet("converter")]
        [ProducesResponseType(200, Type = typeof(CurrencyConverted))]
        [ProducesResponseType(400, Type = typeof(Error))]
        [ProducesResponseType(404, Type = typeof(Error))]
        [ProducesResponseType(503, Type = typeof(Error))]
        public async Task<ActionResult> Converter([FromQuery] string from, [FromQuery] string to, [FromQuery] string amount)
        {
            try
            {
                decimal number = 0;
                bool hasError = true;
                ActionResult returnApi = null;
                dynamic result = null;

                ValidadeInputParams(from, to, amount, ref number, ref hasError, ref returnApi, ref result);

                if (returnApi is null)
                {
                    result = await _exchangeAppService.GetExchange(from.Trim().ToUpper(), to.Trim().ToUpper(), number);

                    if(result.GetType().Name == typeof(CurrencyConverted).Name)
                    {
                        hasError = false;
                        returnApi = Ok(result);
                    }
                    else
                    {
                        switch (result.StatusCode)
                        {
                            case (int)HttpStatusCode.NotFound:
                                returnApi = NotFound(result);
                                break;
                            default:
                                break;
                        }
                    }
                }

                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError, "Converter", (hasError ? result.Message : ""), new string[3] { from, to, amount });
                return returnApi;
            }
            catch (HttpRequestException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.ServiceUnavailableExceededRetry)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (BrokenCircuitException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.ServiceUnavailableBrokenCircuit)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (Exception ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
        }

        [HttpGet("polly")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult> TestPolly([FromQuery] int code)
        {
            try
            {
                await _exchangeAppService.GetTestPolly(code);
                return Ok();
            }
            catch (HttpRequestException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name+"=>"+ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.ServiceUnavailableExceededRetry)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
            }
            catch (BrokenCircuitException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name+"=>"+ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.ServiceUnavailableBrokenCircuit)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (Exception ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name+"=>"+ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
        }

        private void ValidadeInputParams(string from, string to, string amount, ref decimal number, ref bool hasError, ref ActionResult returnApi, ref dynamic response)
        {
            if (String.IsNullOrWhiteSpace(from))
            {
                returnApi = BadRequest(response = new Error(
                        (int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestParamFromIsRequired)
                    );
                return;
            }
            else if (String.IsNullOrWhiteSpace(to))
            {
                returnApi = BadRequest(response = new Error(
                        (int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestParamToIsRequired)
                    );
                return;
            }

            if (String.IsNullOrWhiteSpace(amount))
            {
                returnApi = BadRequest(response = new Error(
                        (int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestParamAmountIsRequired)
                    );
                return;
            }
            else if (!Decimal.TryParse(amount.Trim(), NumberStyles.Number, CultureInfo.InvariantCulture, out number))
            {
                returnApi = BadRequest(
                    response = new Error(
                        (int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestAmountInvalid(amount)
                    )
                );
                return;
            }
        }
    }

}