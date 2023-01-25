using Cuco.Commons.Base;
using Cuco.Commons.Settings;
using Cuco.Domain.Currencies.Services.Repositories;
using Cuco.Domain.Users.Services.Repositories;
using Cuco.Infra.Data.Services.Cache;
using Cuco.Infra.Data.Services.Locking;
using Cuco.Infra.Data.Services.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using StackExchange.Redis;

namespace Cuco.Infra.Data.Extensions;

public static class SetupServicesExtensions
{
    public static IServiceCollection SetupDataServices(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddSettings(configuration)
            .AddRedis(configuration)
            .AddContexts(configuration)
            .AddUnitOfWork()
            .AddRepositories()
            .AddMemoryCache();

        return services;
    }

    private static IServiceCollection AddSettings(this IServiceCollection services, IConfiguration configuration)
    {
        var openExchangeSettings = configuration.GetSection("OpenExchangeSettings").Get<OpenExchangeSettings>();
        var securitySettings = configuration.GetSection("JWT").Get<SecuritySettings>();
        return services.AddSingleton(openExchangeSettings)
            .AddSingleton(securitySettings);
    }

    private static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
    {
        var redis = configuration?.GetSection("Redis").Get<RedisSettings>();
        if (redis is null) return services;
        return services.AddSingleton<IConnectionMultiplexer>(_ =>
            ConnectionMultiplexer.Connect(new ConfigurationOptions()
                {
                    EndPoints = { { redis.Host, redis.Port } },
                    ConnectRetry = 2,
                    ReconnectRetryPolicy = new LinearRetry(10),
                    AbortOnConnectFail = false,
                    ConnectTimeout = 5000,
                    Password = redis.Password
                }))
            .AddSingleton<IRedisCache, RedisCache>()
            .AddSingleton<ILockingService, RedisLockingService>();
    }

    private static IServiceCollection AddContexts(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration?.GetConnectionString("CucoDBContext");
        return connectionString is not null
            ? services.AddDbContext<CucoDbContext>(options =>
            {
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                        o =>
                        {
                            o.SchemaBehavior(MySqlSchemaBehavior.Ignore);
                            o.EnableRetryOnFailure(
                                maxRetryCount: 10,
                                maxRetryDelay: TimeSpan.FromSeconds(30),
                                errorNumbersToAdd: null);
                        })
                    .EnableDetailedErrors();
            })
            : services;
    }

    private static IServiceCollection AddUnitOfWork(this IServiceCollection services)
    {
        return services.AddScoped<IUnitOfWork, UnitOfWork>();
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        return services.AddScoped<ICurrencyRepository, CurrencyRepository>()
            .AddScoped<IUserRepository, UserRepository>();
    }
}