using Cuco.Sync.Cron.Handlers;
using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// Configure Hangfire
GlobalConfiguration.Configuration.UseMemoryStorage();
using var server = new BackgroundJobServer();
var hostBuilder = new HostBuilder()
    .ConfigureServices((_, services) =>
        {
            services.AddHostedService<ScheduledSyncService>();
        }
    );
await hostBuilder.RunConsoleAsync().ConfigureAwait(false);