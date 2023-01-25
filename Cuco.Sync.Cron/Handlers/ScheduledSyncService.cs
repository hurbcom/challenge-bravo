using Cuco.Sync.Cron.Models;
using Flurl.Http;
using Hangfire;
using Microsoft.Extensions.Hosting;

namespace Cuco.Sync.Cron.Handlers;

internal class ScheduledSyncService : IHostedService
{
    private static bool _started;

    public Task StartAsync(CancellationToken cancellationToken)
    {
        return SyncCurrenciesAsync();
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Task stopped.");
        return Task.CompletedTask;
    }

    public static async Task SyncCurrenciesAsync()
    {
        try
        {
            var timestamp = (await GetSyncUrl().GetJsonAsync<Result>())?.ExchangeRateChangeResponse
                ?.Timestamp;
            if (timestamp is null or 0)
            {
                ProcessFailure();
                return;
            }

            var nextCallTime = GetTimeOfNextCallFromTimestamp(timestamp.Value);
            RecurringJob.AddOrUpdate("SyncCurrencies", () => SyncCurrenciesAsync(),
                Hangfire.Cron.Daily(nextCallTime.Hour, nextCallTime.Minute + 1));
            _started = true;
        }
        catch (Exception e)
        {
            Console.WriteLine("Error occurred while trying to Sync Currencies." +
                              $"\nError: {e.Message}");
        }
    }

    private static void ProcessFailure()
    {
        if (_started) return;
        RecurringJob.AddOrUpdate("SyncCurrencies", () => SyncCurrenciesAsync(), Hangfire.Cron.Hourly);
        _started = true;
    }

    private static DateTime GetTimeOfNextCallFromTimestamp(long unixTimestamp)
    {
        return DateTimeOffset.FromUnixTimeSeconds(unixTimestamp).AddHours(1).ToUniversalTime().DateTime;
    }

    private static string GetSyncUrl()
    {
        var cucoApiUrl = Environment.GetEnvironmentVariable("SyncCurrenciesEndpointBaseUrl") ?? "http://localhost:5010/api/";
        return cucoApiUrl.Last() != '/'
            ? cucoApiUrl + "/currency/sync"
            : cucoApiUrl + "currency/sync";
    }
}