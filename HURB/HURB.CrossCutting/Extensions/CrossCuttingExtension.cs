using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HURB.CrossCutting.Extensions
{
    public static class CrossCuttingExtension
    {
        public static IServiceCollection AddCrossCuttingConfigurations(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContexts(configuration)
                    .AddRepositoryInjections()
                    .AddApplicationServiceInjections()
                    .AddServiceInjections()
                    .AddAutoMapperProfiles();

            return services;
        }
    }
}
