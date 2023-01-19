using Cuco.Application.Tests;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[ApiController]
[Route("api/conversion")]
public class CurrencyConversionController : ControllerBase
{
    [HttpGet]

    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<ActionResult> PingAsync(
        [FromServices] IRedisPing service)
    {
        var result = await service.Ping();
        return Ok(result);
    }
}
