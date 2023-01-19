using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;
[ApiController]
[Route("api/conversion")]
public class CurrencyConversionController : ControllerBase
{
    [HttpGet]
    public void Get()
    {
    }
}
