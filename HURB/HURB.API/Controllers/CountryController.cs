using HURB.Core;
using HURB.Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace HURB.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : BaseController
    {
        private readonly ICountryRepository _repository;

        public CountryController(ICountryRepository repository, DomainNotification notification) : base(notification)
        {
            _repository = repository;
        }

        [HttpGet]
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
