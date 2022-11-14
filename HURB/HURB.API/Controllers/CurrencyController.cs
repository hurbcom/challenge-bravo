using Flunt.Notifications;
using HURB.API.Attribute;
using HURB.Application.Interfaces;
using HURB.Application.Model.Request.Currency;
using HURB.Application.Model.Response.Currency;
using HURB.Core;
using HURB.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace HURB.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CurrencyController : BaseController
    {
        private readonly ICurrencyAppService _appService;

        public CurrencyController(ICurrencyAppService appService, DomainNotification notification) : base(notification)
            => _appService = appService;

        [HttpGet, VerifyPermission(Profile.Analyst)]
        [ProducesResponseType(typeof(ICollection<GetCurrencyResponse>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllAsync()
        {
            return await ReturnPackageAsync(async () =>
            {
                var results = await _appService.GetAllAsync();
                return results;
            });
        }

        [HttpGet("{id:guid}"), VerifyPermission(Profile.Analyst)]
        [ProducesResponseType(typeof(ICollection<GetCurrencyResponse>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id)
        {
            return await ReturnPackageAsync(async () =>
            {
                var result = await _appService.GetByIdAsync(id);
                return result;
            });
        }

        [HttpPost(), VerifyPermission(Profile.Analyst)]
        [ProducesResponseType((int)HttpStatusCode.Created)]
        [ProducesResponseType(typeof(IReadOnlyCollection<Notification>), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AddAsync([FromBody] AddCurrencyRequest model)
        {
            if (!model.IsValid())
                return await Task.FromResult<IActionResult>(StatusCode((int)HttpStatusCode.BadRequest, new { validationResults = model.Notifications }));

            return await ReturnPackageAsync(async () =>
            {
                await _appService.AddAsync(model);
            }, HttpStatusCode.Created);
        }

        [HttpPut(), VerifyPermission(Profile.Analyst)]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType(typeof(IReadOnlyCollection<Notification>), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> UpdateAsync([FromBody] UpdateCurrencyRequest model)
        {
            if (!model.IsValid())
                return await Task.FromResult<IActionResult>(StatusCode((int)HttpStatusCode.BadRequest, new { validationResults = model.Notifications }));

            return await ReturnPackageAsync(async () =>
            {
                await _appService.UpdateAsync(model);
            }, HttpStatusCode.NoContent);
        }

        [HttpDelete(), VerifyPermission(Profile.Analyst)]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        public async Task<IActionResult> DeleteAsync([FromBody] Guid id)
        {
            return await ReturnPackageAsync(async () =>
            {
                await _appService.DeleteAsync(id);
            }, HttpStatusCode.NoContent);
        }
    }
}
