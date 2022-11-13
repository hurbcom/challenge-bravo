using HURB.Core;
using Microsoft.Extensions.DependencyInjection;

namespace HURB.CrossCutting.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddServiceInjections(this IServiceCollection services)
        {
            services.AddScoped<DomainNotification>();
            
            return services;
        }
    }
}
