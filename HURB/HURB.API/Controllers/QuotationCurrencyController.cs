using HURB.API.Attribute;
using HURB.Application.Interfaces;
using HURB.Application.Model.QueryFilter;
using HURB.Core;
using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using HURB.Core.Model.Response.QuotationCurrency;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace HURB.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QuotationCurrencyController : BaseController
    {
        private readonly IQuotationCurrencyRepository _repository;
        private readonly IQuotationCurencyAppService _appService;

        public QuotationCurrencyController(IQuotationCurrencyRepository repository, IQuotationCurencyAppService appService, DomainNotification notification) : base(notification)
        {
            _repository = repository;
            _appService = appService;
        }

        [HttpGet("filter"), VerifyPermission(Profile.Analyst)]
        [ProducesResponseType(typeof(ICollection<QuotationCurrencyResponse>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> FilterAsync([FromQuery] QuotationCurrencyFilterQuery filter)
        {
            return await ReturnPackageAsync(async () =>
            {
                var pagedModel = await _appService.FilterAsync(filter);
                return pagedModel;
            });
        }

        [HttpGet, VerifyPermission(Profile.Analyst)]
        [ProducesResponseType(typeof(ICollection<QuotationCurrency>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAll()
        {
            return await ReturnPackageAsync(async () =>
            {
                var pagedModel = await _repository.FilterAsNoTrackingAsync();
                return pagedModel.ToList();
            });
        }
    }
}
