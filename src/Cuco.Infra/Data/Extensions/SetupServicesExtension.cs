using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Services.Repositories;
using Cuco.Infra.Data.Repositories;
using Cuco.Infra.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

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
            .AddRepositories();

        return services;
    }

    private static IServiceCollection AddSettings(this IServiceCollection services, IConfiguration configuration)
    {
        var openExchangeSettings = configuration.GetSection("OpenExchangeSettings").Get<OpenExchangeSettings>();
        return services.AddSingleton(openExchangeSettings);
    }

    private static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
    {
        if (configuration?.GetConnectionString("Redis") is { } connectionString)
            return services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = connectionString;
                options.InstanceName = "CucoAPI:";
            })
                .AddSingleton<ICache, RedisCache>();
        return services;
    }

    private static IServiceCollection AddContexts(this IServiceCollection services, IConfiguration configuration)
        => configuration?.GetConnectionString("CucoDBContext") is { } connectionString
            ? services.AddDbContext<CucoDbContext>(options =>
                {
                    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),o => o.SchemaBehavior(MySqlSchemaBehavior.Ignore))
                           .EnableDetailedErrors();
                })
            : services;

    private static IServiceCollection AddUnitOfWork(this IServiceCollection services)
        => services.AddScoped<IUnitOfWork, UnitOfWork>();

    private static IServiceCollection AddRepositories(this IServiceCollection services)
        => services.AddScoped<ICurrencyRepository, CurrencyRepository>();
}