using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc.Filters;

namespace HURB.API.Filter
{
    public class AuthFilter : IAsyncAuthorizationFilter
    {
        private readonly IUserRepository _userRepository;

        public AuthFilter(IUserRepository userRepository)
            => _userRepository = userRepository;

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            if (context.HttpContext.User.Identity is { IsAuthenticated: true })
            {
                var name = context.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value ?? "";
                var user = await GetUserAsync(name);

                context.HttpContext.Items["AuthenticatedUser"] = user;
            }
        }

        private async Task<User> GetUserAsync(string name)
            => await _userRepository.GetByName(name);
    }
}
