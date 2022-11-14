using HURB.Core;
using HURB.Core.Interfaces.Services;
using HURB.Core.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HURB.CrossCutting.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddServiceInjections(this IServiceCollection services)
        {
            services.AddScoped<DomainNotification>();
            services.AddScoped<AuthToken>();
            services.AddScoped<ICurrencyService, CurrencyService>();
            services.AddScoped<IQuotationService, QuotationService>(); 
            return services;
        }
    }
}
