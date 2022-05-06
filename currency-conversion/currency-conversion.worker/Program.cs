using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.infrastructure.Data.Repositories;
using currency_conversion.worker;
using currency_conversion.infrastructure.Configurations;
using currency_conversion.Core.Interfaces.Services;
using currency_conversion.infrastructure;
using currency_conversion.infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((hostContext,services) =>
    {
        IConfiguration configuration = hostContext.Configuration;
        //services.Configure<CoinBaseConfiguration>(configuration.GetSection(nameof(CoinBaseConfiguration)));
        //var coinBaseApiUrl = Environment.GetEnvironmentVariable("COINBASEAPI_URL");
        //var coinBaseApiFetchIntervalMs = Environment.GetEnvironmentVariable("COINBASEAPI_FETCH_INTERVAL_MS");
        //var coinBaseConfiguration = new CoinBaseConfiguration
        //{
        //    ApiUrl = coinBaseApiUrl,
        //    FetchIntervalMs = int.Parse(coinBaseApiFetchIntervalMs)
        //};
        services.AddHostedService<Worker>();
        services.AddHttpClient();
        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString ?? ""));
        services.AddTransient<ICurrencyRepository, CurrencyRepository>();
        services.AddTransient<ICurrencyFetch, CurrencyFetch>();
    })
    .Build();

await host.RunAsync();
