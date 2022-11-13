using HURB.Core.Interfaces.Repositories;
using HURB.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace HURB.CrossCutting.Extensions
{
    public static class RepositoryExtension
    {
        public static IServiceCollection AddRepositoryInjections(this IServiceCollection services)
        {
            services.AddScoped<ICountryRepository, CountryRepository>();
            services.AddScoped<ICurrencyRepository, CurrencyRepository>();
            services.AddScoped<IQuotationCurrencyRepository, QuotationCurrencyRepository>();

            return services;
        }
    }
}
