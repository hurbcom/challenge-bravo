using HURB.Core;
using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace HURB.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IUserRepository _repository;

        public UserController(IUserRepository repository, DomainNotification notification) : base(notification)
            => _repository = repository;

        [HttpGet]
        [ProducesResponseType(typeof(ICollection<User>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
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
