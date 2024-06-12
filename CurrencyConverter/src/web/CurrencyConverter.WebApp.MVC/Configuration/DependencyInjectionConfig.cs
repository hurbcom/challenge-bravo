using CurrencyConverter.WebApp.MVC.Services;

namespace CurrencyConverter.WebApp.MVC.Configuration
{
    public static class DependencyInjectionConfig
    {
        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddHttpClient<ICurrencyConverterService, CurrencyConverterService>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }
    }
}
