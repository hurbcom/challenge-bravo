using Cuco.Application.Tests;
using Microsoft.Extensions.DependencyInjection;

namespace Cuco.Application.Extensions;

public static class SetupCucoApplicationsExtension
{
    public static IServiceCollection SetupApplicationCucoApi(this IServiceCollection services)
        => services
            .AddSingleton<IRedisPing, RedisPing>();
}