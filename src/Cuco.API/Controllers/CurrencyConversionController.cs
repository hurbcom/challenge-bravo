using Cuco.API.Extensions;
using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;
using Cuco.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[ApiController]
[Produces("application/json")]
[Route("api/convert")]
public class CurrencyConversionController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(CurrencyConversionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> ConvertCurrencyAsync(
        [FromServices] ICurrencyConversionService service,
        [FromQuery] string from,
        [FromQuery] string to,
        [FromQuery] decimal amount)
    {
        try
        {
            var response = await service.ConvertCurrency(new CurrencyConversionRequest
            {
                FromCurrency = from,
                ToCurrency = to,
                Amount = amount
            });
            return response.IsOkay()
                ? Ok(response)
                : response.ToObjectResult();
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}