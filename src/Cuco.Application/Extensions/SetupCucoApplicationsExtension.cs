using Cuco.Application.Adapters;
using Cuco.Application.Adapters.Implementations;
using Cuco.Application.Providers;
using Cuco.Application.Services;
using Cuco.Application.Services.Implementations;
using Microsoft.Extensions.DependencyInjection;

namespace Cuco.Application.Extensions;

public static class SetupCucoApplicationsExtension
{
    public static IServiceCollection SetupApplicationCucoApi(this IServiceCollection services)
    {
        return services
            .AddScoped<ICurrencyConversionService, CurrencyConversionService>()
            .AddScoped<IConvertToDollarService, ConvertToDollarService>()
            .AddScoped<ISyncCurrenciesService, SyncCurrenciesService>()
            .AddScoped<IAddCurrencyService, AddCurrencyService>()
            .AddScoped<IUpdateCurrencyService, UpdateCurrencyService>()
            .AddScoped<IDeleteCurrencyService, DeleteCurrencyService>()
            .AddScoped<ICurrencyExchangeRateAdapter, OpenExchangeRateAdapter>()
            .AddSingleton<ITokenAdapter, TokenAdapter>()
            .AddTransient<IUserProvider, UserProvider>();
    }
}