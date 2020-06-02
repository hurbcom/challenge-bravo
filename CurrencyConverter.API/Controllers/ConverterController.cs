using CurrencyConverter.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using System.Linq;
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
        public async Task<IActionResult> Converter([FromQuery] string from, [FromQuery] string to, [FromQuery] string amount)
        {
            try
            {
                //Logger removed to maximize performance
                if (from == null)
                    return new BadRequestObjectResult(new { Error = "variable 'from' not found or empty" });

                if (to == null)
                    return new BadRequestObjectResult(new { Error = "variable 'to' not found or empty" });

                if (amount == null)
                    return new BadRequestObjectResult(new { Error = "variable 'amount' not found" });

                decimal amountDecimal = 0;
                if (!decimal.TryParse(amount, NumberStyles.AllowDecimalPoint, new NumberFormatInfo() { NumberDecimalSeparator = "," }, out amountDecimal))
                {
                    return new BadRequestObjectResult(new { Error = "variable 'amount' doesn't have valid value (must be positive and use ',' as decimal separator" });
                }

                decimal result = await _converterSrvc.convertCurrencyAsync(from, to, amountDecimal);
                return new OkObjectResult(result);
            }
            catch (Exception)
            {
                return new BadRequestObjectResult(new { Error = "Currency not found" });
            }
        }
    }
}



