using Cuco.Application.AddCurrency;
using Cuco.Application.CurrencyConversion;
using Cuco.Application.DeleteCurrency;
using Cuco.Application.ListCurrencies;
using Cuco.Application.Tests;
using Cuco.Application.UpdateCurrency;
using Microsoft.Extensions.DependencyInjection;

namespace Cuco.Application.Extensions;

public static class SetupCucoApplicationsExtension
{
    public static IServiceCollection SetupApplicationCucoApi(this IServiceCollection services)
        => services
            .AddSingleton<IAddCurrencyService, AddCurrencyService>()
            .AddSingleton<IUpdateCurrencyService, UpdateCurrencyService>()
            .AddSingleton<IListCurrenciesService, ListCurrenciesService>()
            .AddSingleton<IDeleteCurrencyService, DeleteCurrencyService>()
            .AddSingleton<ICurrencyConversionService, CurrencyConversionService>()
            .AddSingleton<IRedisPing, RedisPing>();
}