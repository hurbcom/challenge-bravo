using CurrencyConversion.Infra.Data.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CurrencyConversion.IoC.Extensions;
public static class SetupServicesExtension
{
    public static IServiceCollection SetupServicesCurrencyConversionApi(this IServiceCollection services, IConfiguration configuration)
        => services.SetupDataServices(configuration);

}
