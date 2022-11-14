using Flunt.Notifications;
using HURB.Application.Model.Request.Quotation;
using HURB.Core;
using HURB.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace HURB.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuotationController : BaseController
    {
        private readonly IQuotationService _service;

        public QuotationController(IQuotationService service, DomainNotification notification) : base(notification)
            => _service = service;

        [HttpGet()]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(IReadOnlyCollection<Notification>), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GetByIdAsync([FromQuery] QuotationRequest model)
        {
            return await ReturnPackageAsync(async () =>
            {
                var result = await _service.GetQuotation(model.From, model.To, model.Amount);
                return result;
            });
        }
    }
}
