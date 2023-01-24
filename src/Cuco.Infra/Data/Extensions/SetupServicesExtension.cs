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
        var securitySettings = configuration.GetSection("Security").Get<SecuritySettings>();
        return services.AddSingleton(openExchangeSettings)
            .AddSingleton(securitySettings);
    }

    private static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
    {
        if (configuration?.GetConnectionString("Redis") is { } connectionString)
            return services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(connectionString))
                .AddSingleton<IRedisCache, RedisCache>()
                .AddSingleton<ILockingService, RedisLockingService>();
        return services;
    }

    private static IServiceCollection AddContexts(this IServiceCollection services, IConfiguration configuration)
    {
        return configuration?.GetConnectionString("CucoDBContext") is { } connectionString
            ? services.AddDbContext<CucoDbContext>(options =>
            {
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                        o => o.SchemaBehavior(MySqlSchemaBehavior.Ignore))
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