using Cuco.Commons.Base;
using Cuco.Domain.CurrenciesData.Models.Entities;
using Cuco.Domain.CurrenciesData.Services.Repositories;
using Cuco.Infra.Data.Repositories;
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
            .AddContexts(configuration)
            .AddUnitOfWork()
            .AddRepositories();

        return services;
    }

    private static IServiceCollection AddRedis(this IServiceCollection services, IConfiguration configuration)
        => configuration?.GetConnectionString("Redis") is { } connectionString
            ? services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = connectionString;
                    options.InstanceName = "CucoAPI:";
                })
            : services;

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
        => services.AddScoped<ICurrencyDataRepository, CurrencyDataRepository>();
}