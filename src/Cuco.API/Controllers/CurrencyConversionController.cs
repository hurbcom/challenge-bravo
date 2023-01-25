using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Commons;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[ApiController]
[Route("api/convert")]
public class CurrencyConversionController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(Result<CurrencyConversionOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> ConvertCurrencyAsync(
        [FromServices] IService<CurrencyConversionInput, CurrencyConversionOutput> service,
        [FromQuery] string from,
        [FromQuery] string to,
        [FromQuery] decimal amount)
    {
        try
        {
            var result = new Result<CurrencyConversionOutput>
            {
                Output = await service.Handle(new CurrencyConversionInput
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