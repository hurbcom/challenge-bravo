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
        [ProducesResponseType(200, Type = typeof(string))]
        [ProducesResponseType(400)]
        public IActionResult Converter(string from, string to, decimal value)
        {
            try
            {
                #region Log Info
                string[] param = { from, to, value.ToString() };

                _logger.LogInformation(
                    MessageLog.InfoController(ControllerContext.RouteData.Values["controller"].ToString().ToUpper(),
                                              ControllerContext.RouteData.Values["action"].ToString(),
                                              param)
                    );
                #endregion

                return Ok(String.Format("From:{0}, To:{1}, Value:{2}", from, to, value.ToString()));
            }
            catch (Exception ex)
            {
                #region Log Error
                _logger.LogError(
                    MessageLog.ErrorController(ControllerContext.RouteData.Values["controller"].ToString().ToUpper(),
                                              ControllerContext.RouteData.Values["action"].ToString(),
                                              ex.Message.ToString())
                    );
                #endregion
                return new BadRequestObjectResult(ex);
            }
           
        }

    }

}