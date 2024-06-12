using CurrencyConverter.Api.Data;
using CurrencyConverter.Api.Settings;
using Microsoft.EntityFrameworkCore;

namespace CurrencyConverter.Api.Configuration
{
    public static class MongoDbConfiguration
    {
        public static IServiceCollection AddMongoDbConfig(this IServiceCollection services, IConfiguration configuration)
        {
            var mongoDBSettings = configuration.GetSection("CurrencyDatabase").Get<CurrencyDatabaseSettings>();

            services.Configure<CurrencyDatabaseSettings>(configuration.GetSection("CurrencyDatabase"));

            services.AddDbContext<CurrencyDbContext>(options =>
                options.UseMongoDB(mongoDBSettings.ConnectionString, mongoDBSettings.DatabaseName));

            return services;
        }
    }
}
