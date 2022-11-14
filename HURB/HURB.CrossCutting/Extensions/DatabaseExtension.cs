using HURB.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HURB.CrossCutting.Extensions
{
    public static class DatabaseExtension
    {
        public static IServiceCollection AddDbContexts(this IServiceCollection services, IConfiguration configuration)
        {
            var connection = Environment.GetEnvironmentVariable("CONNECTION") ?? configuration.GetConnectionString("HURBContext");

            services.AddDbContext<HURBContext>(options =>
                options.UseSqlServer(connection, sqlServerOptions => sqlServerOptions.CommandTimeout(60)));

            return services;
        }
    }
}
