using CurrencyConversion.Infra.Data;
using CurrencyConversion.Infra.Data.UnitsOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace CurrencyConversion.Infra.Data.Extensions;

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

    private static IServiceCollection AddContexts(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration?.GetConnectionString("CurrencyConversionDBContext") ?? "";

        var serverVersion = ServerVersion.AutoDetect(connectionString);

        services.AddDbContext<CurrencyConversionDbContext>(options =>
        {
            options
                .UseMySql(connectionString, serverVersion, o => o.SchemaBehavior(MySqlSchemaBehavior.Ignore))
                .EnableDetailedErrors();
        });

        return services;
    }

    private static IServiceCollection AddUnitOfWork(this IServiceCollection services)
    {
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        return services;
    }
}