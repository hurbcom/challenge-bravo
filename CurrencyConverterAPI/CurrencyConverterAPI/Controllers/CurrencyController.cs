using Microsoft.AspNetCore.Mvc;

namespace CurrencyConverterAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurrencyController : ControllerBase
    {
        [HttpGet("converter/{from}/{to}/{value}")]
        public IActionResult Get(string from, string to, string value)
        {
            return Ok(String.Format("From:{0}, To:{1}, Value:{2}", from, to, value));
        }
    }
}