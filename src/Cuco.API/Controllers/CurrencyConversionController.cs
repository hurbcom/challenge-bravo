using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;
using Cuco.Application.Services;
using Cuco.Commons;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[ApiController]
[Route("api/convert")]
public class CurrencyConversionController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<CurrencyConversionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult> ConvertCurrencyAsync(
        [FromServices] ICurrencyConversionService service,
        [FromQuery] string from,
        [FromQuery] string to,
        [FromQuery] decimal amount)
    {
        try
        {
            var result = new Result<CurrencyConversionResponse>
            {
                Output = await service.ConvertCurrency(new CurrencyConversionRequest
                {
                    FromCurrency = from,
                    ToCurrency = to,
                    Amount = amount
                })
            };
            return Ok(result);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}