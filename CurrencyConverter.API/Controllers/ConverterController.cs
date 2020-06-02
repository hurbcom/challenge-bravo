using CurrencyConverter.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CurrencyConverter.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConverterController : ControllerBase
    {
        private readonly IConverterSrvc _converterSrvc;
        public ConverterController(IConverterSrvc converterSrvc)
        {
            _converterSrvc = converterSrvc;
        }

        [HttpGet("/Converter")]
        public async Task<IActionResult> Converter([FromQuery] string from, [FromQuery] string to, [FromQuery] decimal amount)
        {
            try
            {
                //Logger removed to maximize performance
                if (from == null)
                    return new BadRequestObjectResult(new { Error = "variable 'from' not found or empty" });

                if (to == null)
                    return new BadRequestObjectResult(new { Error = "variable 'to' not found or empty" });

                if (amount <= 0)
                    return new BadRequestObjectResult(new { Error = "variable 'amount' not found or not positive value" });

                decimal result = 0;
                result = await _converterSrvc.convertCurrencyAsync(from, to, amount);
                return new OkObjectResult(result);
            }
            catch (Exception)
            {
                return new BadRequestObjectResult(new { Error = "Currency not found" });
            }
        }
    }
}



