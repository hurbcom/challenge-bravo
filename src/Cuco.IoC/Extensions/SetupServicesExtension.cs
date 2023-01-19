using Cuco.Infra.Data.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cuco.IoC.Extensions;
public static class SetupServicesExtension
{
    public static IServiceCollection SetupServicesCucoApi(this IServiceCollection services, IConfiguration configuration)
        => services.SetupDataServices(configuration);

}
