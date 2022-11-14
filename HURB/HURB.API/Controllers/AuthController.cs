using HURB.Core;
using HURB.Core.Interfaces.Repositories;
using HURB.Core.Model.Request.Auth;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace HURB.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly IUserRepository _repUser;
        private readonly AuthToken _authToken;

        public AuthController(IUserRepository repUser, DomainNotification notification, AuthToken authToken) : base(notification)
        {
            _repUser = repUser;
            _authToken = authToken;
        }

        [HttpPost]
        [ProducesResponseType(typeof(AuthenticateResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AuthenticateAsync(string userName)
        {
            var user = await _repUser.GetByName(userName);
            if (user == null)
                return await Task.FromResult<IActionResult>(StatusCode((int)HttpStatusCode.BadRequest, new { mensage = "User not found." }));

            return await ReturnPackageAsync(async () =>
            {
                return await _authToken.GenerateToken(user);
            });
        }
    }
}
