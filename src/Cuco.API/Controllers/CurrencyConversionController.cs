using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Commons;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[ApiController]
[Route("api/conversion")]
public class CurrencyConversionController : ControllerBase
{
    [HttpGet]

    [ProducesResponseType(typeof(Result<CurrencyConversionOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> ConvertCurrencyAsync(
        [FromServices] IService<CurrencyConversionInput, CurrencyConversionOutput> service,
        [FromQuery] string fromCurrency,
        [FromQuery] string toCurrency,
        [FromQuery] decimal amount)
    {
        try
        {
            var result = new Result<CurrencyConversionOutput>()
            {
                Output = await service.Handle(new()
                {
                    FromCurrency = fromCurrency,
                    ToCurrency = toCurrency,
                    Amount = amount
                })
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
