using CurrencyAPI.Models;
using CurrencyAPI.Validators;
using Microsoft.AspNetCore.Mvc;
using SharedLibrary;
using SharedLibrary.Models;
using System;
using System.Threading.Tasks;

namespace CurrencyAPI.Controllers
{
    public class ConvertController : Controller
    {
        private SQLLiteDbContext _dbContext;

        public ConvertController(SQLLiteDbContext liteDbContext)
        {
            _dbContext = liteDbContext;
        }

        [HttpGet]
        [ApiKey]
        [Route("api/ConvertCurrency")]
        public async Task<ConversionResponseObject> ConvertCurrency([FromQuery] ConversionRequestObject request)
        {
            ConversionResponseObject response = new ConversionResponseObject();

            string errorMessage = String.Empty;
            if(!RequestValidator.ConversionValidation(request, out errorMessage))
            {
                response.Success    = false;
                response.Status     = errorMessage;
                return response;
            }

            CurrencyObject fromCurrency = await _dbContext.FindOne(request.From);
            if (fromCurrency == null)
            {
                response.Success    = false;
                response.Status     = String.Format("Could not id original currency '{0}'. Try adding it first.", request.From);
                return response;
            }

            CurrencyObject toCurrency   = await _dbContext.FindOne(request.To);
            if (toCurrency == null)
            {
                response.Success    = false;
                response.Status     = String.Format("Could not id destination currency '{0}'. Try adding it first.", request.To);
                return response;
            }

            response.ConvertedValue = Math.Round(request.Amount * fromCurrency.Price / toCurrency.Price, 2);
            response.Success        = true;
            response.Status         = "Conversion was a success";
            return response;
        }
    }
}
