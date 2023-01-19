using Cuco.Application.AddCurrency;
using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Application.CurrencyConversion.Services;
using Cuco.Application.DeleteCurrency;
using Cuco.Application.GetCurrencyInUSD;
using Cuco.Application.ListCurrencies;
using Cuco.Application.Tests;
using Cuco.Application.UpdateCurrency;
using Microsoft.Extensions.DependencyInjection;

namespace Cuco.Application.Extensions;

public static class SetupCucoApplicationsExtension
{
    public static IServiceCollection SetupApplicationCucoApi(this IServiceCollection services)
        => services
            .AddSingleton<IService<CurrencyConversionInput, CurrencyConversionOutput>, CurrencyConversionService>()
            .AddSingleton<IGetCurrencyInUsdService, GetCurrencyInUsdService>()
            .AddSingleton<IAddCurrencyService, AddCurrencyService>()
            .AddSingleton<IUpdateCurrencyService, UpdateCurrencyService>()
            .AddSingleton<IListCurrenciesService, ListCurrenciesService>()
            .AddSingleton<IDeleteCurrencyService, DeleteCurrencyService>()
            .AddSingleton<IRedisPing, RedisPing>();
}