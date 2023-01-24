using Cuco.Application.Base;
using Cuco.Application.Currencies.AddCurrency.Models;
using Cuco.Application.Currencies.AddCurrency.Services;
using Cuco.Application.Currencies.DeleteCurrency.Models;
using Cuco.Application.Currencies.DeleteCurrency.Services;
using Cuco.Application.Currencies.GetCurrencyInUSD.Models;
using Cuco.Application.Currencies.GetCurrencyInUSD.Services;
using Cuco.Application.Currencies.SyncCurrencies.Models;
using Cuco.Application.Currencies.SyncCurrencies.Services;
using Cuco.Application.Currencies.UpdateCurrency.Models;
using Cuco.Application.Currencies.UpdateCurrency.Services;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Application.CurrencyConversion.Services;
using Cuco.Application.OpenExchangeRate.Adapters;
using Cuco.Application.Users.TokenAdapters;
using Cuco.Application.Users.UserProviders;
using Microsoft.Extensions.DependencyInjection;

namespace Cuco.Application.Extensions;

public static class SetupCucoApplicationsExtension
{
    public static IServiceCollection SetupApplicationCucoApi(this IServiceCollection services)
    {
        return services
            .AddScoped<IService<CurrencyConversionInput, CurrencyConversionOutput>, CurrencyConversionService>()
            .AddScoped<IService<GetCurrencyInUsdInput, GetCurrencyInUsdOutput>, GetCurrencyInUsdService>()
            .AddScoped<IService<SyncCurrenciesInput, SyncCurrenciesOutput>, SyncCurrenciesService>()
            .AddScoped<IService<AddCurrencyInput, AddCurrencyOutput>, AddCurrencyService>()
            .AddScoped<IService<UpdateCurrencyInput, UpdateCurrencyOutput>, UpdateCurrencyService>()
            .AddScoped<IService<DeleteCurrencyInput, DeleteCurrencyOutput>, DeleteCurrencyService>()
            .AddScoped<ICurrencyExchangeRateAdapter, OpenExchangeRateAdapter>()
            .AddSingleton<ITokenAdapter, TokenAdapter>()
            .AddTransient<IUserProvider, UserProvider>();
    }
}