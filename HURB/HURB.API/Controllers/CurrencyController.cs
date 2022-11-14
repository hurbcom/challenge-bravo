using Flunt.Notifications;
using HURB.Application.Interfaces;
using HURB.Application.Model.Request.Currency;
using HURB.Application.Model.Response.Currency;
using HURB.Core;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace HURB.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyController : BaseController
    {
        private readonly ICurrencyAppService _appService;

        public CurrencyController(ICurrencyAppService appService, DomainNotification notification) : base(notification)
            => _appService = appService;

        [HttpGet]
        [ProducesResponseType(typeof(ICollection<GetCurrencyResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GetAllAsync()
        {
            return await ReturnPackageAsync(async () =>
            {
                var results = await _appService.GetAllAsync();
                return results;
            });
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(ICollection<GetCurrencyResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id)
        {
            return await ReturnPackageAsync(async () =>
            {
                var result = await _appService.GetByIdAsync(id);
                return result;
            });
        }

        [HttpPost()]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        [ProducesResponseType(typeof(IReadOnlyCollection<Notification>), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> AddAsync([FromBody] AddCurrencyRequest model)
        {
            if (!model.IsValid())
                return await Task.FromResult<IActionResult>(StatusCode((int)HttpStatusCode.BadRequest, new { validationResults = model.Notifications }));

            return await ReturnPackageAsync(async () =>
            {
                await _appService.AddAsync(model);
            }, HttpStatusCode.Created);
        }

        [HttpPut()]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType(typeof(IReadOnlyCollection<Notification>), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> UpdateAsync([FromBody] UpdateCurrencyRequest model)
        {
            if (!model.IsValid())
                return await Task.FromResult<IActionResult>(StatusCode((int)HttpStatusCode.BadRequest, new { validationResults = model.Notifications }));

            return await ReturnPackageAsync(async () =>
            {
                await _appService.UpdateAsync(model);
            }, HttpStatusCode.NoContent);
        }

        [HttpDelete()]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> DeleteAsync([FromBody] Guid id)
        {
            return await ReturnPackageAsync(async () =>
            {
                await _appService.DeleteAsync(id);
            }, HttpStatusCode.NoContent);
        }
    }
}
