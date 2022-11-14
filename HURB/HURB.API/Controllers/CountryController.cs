using HURB.API.Attribute;
using HURB.Core;
using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace HURB.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : BaseController
    {
        private readonly ICountryRepository _repository;

        public CountryController(ICountryRepository repository, DomainNotification notification) : base(notification)
            => _repository = repository;

        [HttpGet, VerifyPermission(Profile.Analyst)]
        [ProducesResponseType(typeof(ICollection<Country>), (int)HttpStatusCode.OK)]
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
