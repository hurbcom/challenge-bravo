using Cuco.Application.AddCurrency.Models;
using Cuco.Application.Base;
using Cuco.Application.Currencies.AddCurrency.Services;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Application.CurrencyConversion.Services;
using Cuco.Application.DeleteCurrency.Models;
using Cuco.Application.DeleteCurrency.Services;
using Cuco.Application.GetCurrencyInUSD.Models;
using Cuco.Application.GetCurrencyInUSD.Services;
using Cuco.Application.OpenExchangeRate.Adapters;
using Cuco.Application.SyncCurrencies.Models;
using Cuco.Application.SyncCurrencies.Services;
using Cuco.Application.Token;
using Cuco.Application.UpdateCurrency.Models;
using Cuco.Application.UpdateCurrency.Services;
using Cuco.Application.UserProviders;
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