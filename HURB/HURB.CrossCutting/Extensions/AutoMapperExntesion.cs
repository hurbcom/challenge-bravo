using HURB.Application.Mapper;
using Microsoft.Extensions.DependencyInjection;

namespace HURB.CrossCutting.Extensions
{
    public static class AutoMapperExntesion
    {
        public static IServiceCollection AddAutoMapperProfiles(this IServiceCollection services)
        {
            services.AddSingleton(AutoMapperConfig.GetMappings());

            return services;
        }
    }
}
