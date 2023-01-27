using Cuco.Sync.Cron.Models;
using Flurl.Http;
using Hangfire;
using Microsoft.Extensions.Hosting;
using Polly;

namespace Cuco.Sync.Cron.Handlers;

internal class ScheduledSyncService : IHostedService
{
    public Task StartAsync(CancellationToken cancellationToken)
    {
        return SyncCurrenciesAsync();
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Task stopped.");
        return Task.CompletedTask;
    }

    private static async Task SyncCurrenciesAsync()
    {
        var retryPolicy = Policy.Handle<FlurlHttpException>()
            .WaitAndRetryAsync(7, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt - 1)));
        try
        {

            var timeResponse = await retryPolicy.ExecuteAsync(async ()
                => await GetSyncUrl().GetJsonAsync<CurrencySyncResponse>());
            var timestamp = timeResponse.Timestamp;

            var nextCallTime = GetTimeOfNextCallFromTimestamp(timestamp);
            RecurringJob.AddOrUpdate("SyncCurrencies", () => SyncCurrenciesAsync(),
                Hangfire.Cron.Daily(nextCallTime.Hour, nextCallTime.Minute + 1));
        }
        catch (Exception e)
        {
            Console.WriteLine("Error occurred while trying to Sync Currencies." +
                              $"\nError: {e.Message}");
            throw;
        }
    }

    private static DateTime GetTimeOfNextCallFromTimestamp(long unixTimestamp)
    {
        return DateTimeOffset.FromUnixTimeSeconds(unixTimestamp).AddHours(1).ToUniversalTime().DateTime;
    }

    private static string GetSyncUrl()
    {
        var cucoApiUrl = Environment.GetEnvironmentVariable("SyncCurrenciesEndpointBaseUrl") ?? "http://localhost:5100/api/";
        return cucoApiUrl.Last() != '/'
            ? cucoApiUrl + "/currency/sync"
            : cucoApiUrl + "currency/sync";
    }
}