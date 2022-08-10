using CurrencyConverterAPI.Application.AppServices;
using CurrencyConverterAPI.CrossCutting.HandlerErrorMessage;
using CurrencyConverterAPI.CrossCutting.Log;
using CurrencyConverterAPI.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Polly.CircuitBreaker;
using System.Net;

namespace CurrencyConverterAPI.Controllers
{

    [ApiVersion("1")]
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = true)]
    [Route("api/polly/v{version:apiVersion}")]
    public class PollyController : ControllerBase
    {
        private readonly ILogger<PollyController> _logger;
        private readonly IExchangeAppService _exchangeAppService;

        public PollyController(ILogger<PollyController> logger, IExchangeAppService exchangeAppService)
        {
            _logger = logger;
            _exchangeAppService = exchangeAppService;
        }

        [HttpGet("{statusCode}")]
        public async Task<ActionResult> TestPolly(int statusCode)
        {
            try
            {
                await _exchangeAppService.GetTestPolly(statusCode);
                return Ok();
            }
            catch (HttpRequestException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.ServiceUnavailableExceededRetry)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
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
    }

}