using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CurrencyConverter.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConverterController : ControllerBase
    {
        [HttpGet("/Converter")]
        public async Task<IActionResult> Converter([FromServices]IDistributedCache _cache, [FromQuery] string from = "", [FromQuery] string to = "", [FromQuery] float amount = 0)
        {
            try
            {
                float result = 0;
                //Logger removed to maximize performance
                if (from.Any() && to.Any() && amount > 0)
                {
                    await Task.Run(async () =>
                    {
                        var fromRate = float.Parse(await _cache.GetStringAsync(from));
                        var toRate = float.Parse(await _cache.GetStringAsync(to));

                        var fromAmount = amount * fromRate;
                        var toAmount = fromAmount / toRate;
                        result = toAmount;
                    });
                    return new OkObjectResult(result);
                }
                else
                {
                    return new BadRequestObjectResult(new { Error = "Verify if these currencies exists and amount is positive" });
                }
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { Error = "Currency not found" });
            }
        }
    }
}



