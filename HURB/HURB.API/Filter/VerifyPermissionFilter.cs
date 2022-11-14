using HURB.API.Attribute;
using HURB.Core;
using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;

namespace HURB.API.Filter
{
    public class VerifyPermissionFilter : IAsyncActionFilter
    {
        private readonly IUserRepository _userRepository;

        public VerifyPermissionFilter(IUserRepository userRepository)
            => _userRepository = userRepository;

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!IsAuthenticated(context))
            {
                await next();
                return;
            }

            var profileAttribute = GetVerifyProfileAttribute(context);

            if (profileAttribute != null)
            {
                var user = GetUser(context);
                var profile = GetProfile(profileAttribute);

                bool hasPermission = await HasAnyPermission(user, profile);
                if (user is null || !hasPermission)
                {
                    await WriteForbiddenAsync(context);
                    return;
                }
            }
            await next();
        }

        private async Task<bool> HasAnyPermission(User user, string profile)
        {
            var currentUser = await _userRepository.GetByName(user.Name);
            if (currentUser == null)
                return false;
            return currentUser.Profile.ToString() == profile;
        }

        private bool IsAuthenticated(ActionExecutingContext context)
            => context.HttpContext.User.Identity.IsAuthenticated;

        private VerifyPermissionAttribute GetVerifyProfileAttribute(ActionExecutingContext context)
        {
            var permissionAttribute = context.ActionDescriptor.EndpointMetadata
                .FirstOrDefault(x => x.GetType() == typeof(VerifyPermissionAttribute)) as VerifyPermissionAttribute;

            return permissionAttribute;
        }

        private string GetProfile(VerifyPermissionAttribute permissionAttribute)
           => permissionAttribute.Profile.ToString();

        private User GetUser(ActionExecutingContext context)
            => context.HttpContext.GetLoggedUser();

        private Task WriteForbiddenAsync(ActionExecutingContext context)
        {
            var response = new
            {
                Code = StatusCodes.Status403Forbidden,
                Message = "You don't have permission to access this action"
            };

            context.Result = new ContentResult()
            {
                ContentType = "application/json",
                StatusCode = StatusCodes.Status403Forbidden,
                Content = JsonConvert.SerializeObject(response)
            };

            return Task.CompletedTask;
        }
    }
}
