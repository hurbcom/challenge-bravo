using CurrencyConverterAPI.Application.AppServices;
using CurrencyConverterAPI.CrossCutting.HandlerErrorMessage;
using CurrencyConverterAPI.CrossCutting.Log;
using CurrencyConverterAPI.Domain.Models;
using Microsoft.AspNetCore.Mvc;
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


        [HttpGet("converter")]
        [ProducesResponseType(200, Type = typeof(CurrencyConvertedResponse))]
        [ProducesResponseType(400, Type = typeof(CurrencyConvertedResponse))]
        [ProducesResponseType(404, Type = typeof(CurrencyConvertedResponse))]
        public async Task<ActionResult> Converter([FromQuery] string from, [FromQuery] string to, [FromQuery] string amount)
        {
            try
            {
                decimal number = 0;
                bool hasError = true;
                ActionResult returnApi = null;
                CurrencyConvertedResponse result = null;

                ValidadeInputParams(from, to, amount, ref number, ref hasError, ref returnApi, ref result);

                if (returnApi is null)
                {
                    result = await _exchangeAppService.GetExchange(from.Trim().ToUpper(), to.Trim().ToUpper(), number);

                    switch (result.StatusCode)
                    {
                        case (int)HttpStatusCode.OK:
                            hasError = false;
                            returnApi = Ok(result);
                            break;
                        case (int)HttpStatusCode.NotFound:
                            returnApi = NotFound(result);
                            break;
                        default:
                            break;
                    }
                }

                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError, "Converter", result.Error?.Message, new string[3] { from, to, amount });
                return returnApi;

            }
            catch (Exception ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: false, "Converter", ex.Message.ToString());
                return new BadRequestObjectResult(
                    new CurrencyConvertedResponse(
                        (int)HttpStatusCode.BadRequest, new Error(HandlerErrorResponseMessage.Exception)
                    )
                );
            }

        }

        private void ValidadeInputParams(string from, string to, string amount, ref decimal number, ref bool hasError, ref ActionResult returnApi, ref CurrencyConvertedResponse response)
        {
            if (String.IsNullOrWhiteSpace(from))
            {
                returnApi = BadRequest(response = new CurrencyConvertedResponse(
                        (int)HttpStatusCode.BadRequest, new Error(HandlerErrorResponseMessage.BadRequestParamFromIsRequired)
                    ));
            }
            else if (String.IsNullOrWhiteSpace(to))
            {
                returnApi = BadRequest(response = new CurrencyConvertedResponse(
                        (int)HttpStatusCode.BadRequest, new Error(HandlerErrorResponseMessage.BadRequestParamToIsRequired)
                    ));
            }

            if (String.IsNullOrWhiteSpace(amount))
            {
                returnApi = BadRequest(response = new CurrencyConvertedResponse(
                        (int)HttpStatusCode.BadRequest, new Error(HandlerErrorResponseMessage.BadRequestParamAmountIsRequired)
                    ));
            }
            else if (!Decimal.TryParse(amount.Trim(), NumberStyles.Number, CultureInfo.InvariantCulture, out number))
            {
                returnApi = BadRequest(
                    response = new CurrencyConvertedResponse(
                        (int)HttpStatusCode.BadRequest, new Error(HandlerErrorResponseMessage.BadRequestAmountInvalid(amount))
                    )
                );
            }
        }
    }

}