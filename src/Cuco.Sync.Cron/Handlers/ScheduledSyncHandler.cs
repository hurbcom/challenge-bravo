using Cuco.Sync.Cron.Models;
using Flurl.Http;
using Hangfire;

namespace Cuco.Sync.Cron.Handlers;

internal static class ScheduledSyncHandler
{
    private static readonly string SyncCurrenciesEndpointUrl =
        Environment.GetEnvironmentVariable("SyncCurrenciesEndpointUrl") ?? "http://localhost:5010/api/currency/sync";

    private static bool _started;

    public static async Task SyncCurrenciesAsync()
    {
        try
        {
            Console.WriteLine("Entered.");
            var timestamp = (await SyncCurrenciesEndpointUrl.GetJsonAsync<Result>())?.ExchangeRateChangeResponse
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
}