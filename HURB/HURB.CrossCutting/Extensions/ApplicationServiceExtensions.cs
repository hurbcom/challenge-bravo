using HURB.Application.Interfaces;
using HURB.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HURB.CrossCutting.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServiceInjections(this IServiceCollection services)
        {
            services.AddScoped<ICountryAppService, CountryAppService>();
            services.AddScoped<ICurrencyAppService, CurrencyAppService>();
            services.AddScoped<IQuotationCurencyAppService, QuotationCurencyAppService>();

            return services;
        }
    }
}
