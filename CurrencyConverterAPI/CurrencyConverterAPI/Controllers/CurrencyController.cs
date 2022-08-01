using CurrencyConverterAPI.Helper.Log;
using Microsoft.AspNetCore.Mvc;

namespace CurrencyConverterAPI.Controllers
{
    [ApiVersion("1")]
    [ApiController]
    [Route("api/[controller]/v{version:apiVersion}")]
    public class CurrencyController : ControllerBase
    {
        private readonly ILogger<CurrencyController> _logger;

        public CurrencyController(ILogger<CurrencyController> logger)
        {
            _logger = logger;
        }


        [HttpGet("converter/{from}/{to}/{value}")]
        public IActionResult Converter(string from, string to, string value)
        {
            #region Log
            string[] param = { from, to, value };

            _logger.LogInformation(
                MessageLog.InfoController(ControllerContext.RouteData.Values["controller"].ToString().ToUpper(),
                                          ControllerContext.RouteData.Values["action"].ToString(),
                                          param)
                );
            #endregion

            return Ok(String.Format("From:{0}, To:{1}, Value:{2}", from, to, value));
        }

    }

}