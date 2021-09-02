using CurrencyQuotation.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CurrencyQuotation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyQuotationController : ControllerBase
    {
        private readonly ILogger<CurrencyQuotationController> _logger;

        private readonly ICurrencyQuotationService _currencyQuotationService;

        public CurrencyQuotationController(ILogger<CurrencyQuotationController> logger, ICurrencyQuotationService quotationService)
        {
            this._currencyQuotationService = quotationService;
            this._logger = logger;
        }

    }
}
