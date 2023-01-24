using System.Security.Claims;
using Cuco.Application.UserProviders;
using Microsoft.AspNetCore.Http;

namespace Cuco.Application.Users.UserProviders;

public class UserProvider : IUserProvider
{
    private readonly ClaimsPrincipal _principal;

    public UserProvider(IHttpContextAccessor context)
    {
        if (context is null) throw new ArgumentNullException(nameof(context));
        _principal = context.HttpContext?.User ?? throw new ArgumentNullException(nameof(_principal));
    }

    public string GetUserName()
    {
        return _principal?.Identity?.Name ?? string.Empty;
    }

    public bool UserIsRole(string role)
    {
        return _principal?.IsInRole(role) ?? false;
    }
}