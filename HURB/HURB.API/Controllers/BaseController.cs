using HURB.Core;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace HURB.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private readonly DomainNotification _notification;

        public BaseController(DomainNotification notification)
            => _notification = notification;

        protected async Task<IActionResult> ReturnPackageAsync(Func<Task<dynamic>> procedure,
                                                               HttpStatusCode status = HttpStatusCode.OK,
                                                               string? message = null)
        {
            try
            {
                var result = await procedure();

                if (result is ObjectResult)
                    return result;

                if (message == null)
                    return StatusCode((int)status, result);

                return StatusCode((int)status, new { mensagem = message });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new { mensagem = ex.Message });
            }
        }

        protected async Task<IActionResult> ReturnPackageAsync(Func<Task> procedure,
                                                               HttpStatusCode status = HttpStatusCode.OK,
                                                               string? message = null)
        {
            try
            {
                await procedure();

                if (_notification.HasNotifications)
                    return StatusCode((int)HttpStatusCode.BadRequest, new { validationResults = _notification.Notifications });

                if (message == null)
                    return StatusCode((int)status);

                return StatusCode((int)status, new { mensagem = message });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new { mensagem = ex.Message });
            }
        }
    }
}
