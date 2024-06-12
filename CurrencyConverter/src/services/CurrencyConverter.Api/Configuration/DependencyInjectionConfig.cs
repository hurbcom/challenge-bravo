using CurrencyConverter.Api.Data;
using CurrencyConverter.Api.Services;

namespace CurrencyConverter.Api.Configuration
{
    public static class DependencyInjectionConfig
    {
        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<ICurrencyRepository, CurrencyRepository>();
            services.AddScoped<IFiatConvertService, FiatConvertService>();
            services.AddScoped<IBitCoinConvertService, BitCoinConvertService>();
            services.AddScoped<IFictionCurrencyService, FictionCurrencyService>();
            services.AddScoped<ICurrencyService, CurrencyService>();
            services.AddHttpClient<IBitCoinConvertService, BitCoinConvertService>();
        }
    }
}
