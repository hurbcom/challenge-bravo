using Cuco.Application.AddCurrency;
using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Application.CurrencyConversion.Services;
using Cuco.Application.DeleteCurrency;
using Cuco.Application.GetCurrencyInUSD;
using Cuco.Application.ListCurrencies;
using Cuco.Application.SyncCurrency;
using Cuco.Application.Tests;
using Cuco.Application.UpdateCurrency;
using Microsoft.Extensions.DependencyInjection;

namespace Cuco.Application.Extensions;

public static class SetupCucoApplicationsExtension
{
    public static IServiceCollection SetupApplicationCucoApi(this IServiceCollection services)
        => services
            .AddScoped<IService<CurrencyConversionInput, CurrencyConversionOutput>, CurrencyConversionService>()
            .AddScoped<IGetCurrencyInUsdService, GetCurrencyInUsdService>()
            .AddScoped<ISyncCurrencyService, SyncCurrencyService>()
            .AddScoped<IAddCurrencyService, AddCurrencyService>()
            .AddScoped<IUpdateCurrencyService, UpdateCurrencyService>()
            .AddScoped<IListCurrenciesService, ListCurrenciesService>()
            .AddScoped<IDeleteCurrencyService, DeleteCurrencyService>()
            .AddScoped<IRedisPing, RedisPing>();
}