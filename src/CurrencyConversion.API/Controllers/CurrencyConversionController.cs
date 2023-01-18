using Microsoft.AspNetCore.Mvc;

namespace CurrencyConversionAPI.Controllers;
[ApiController]
[Route("[controller]")]
public class CurrencyConversionController : ControllerBase
{
    [HttpGet]
    public void Get()
    {
    }
}
