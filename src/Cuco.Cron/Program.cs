using Cuco.Cron;
using Cuco.Cron.Handlers;
using Hangfire;
using Hangfire.MemoryStorage;

// Configure Hangfire
GlobalConfiguration.Configuration.UseMemoryStorage();
using var server = new BackgroundJobServer();

// Run and setup recurring
await ScheduledSyncHandler.SyncCurrenciesAsync();

// Wait for the user to exit the application
Console.WriteLine("Press any key to exit...");
Console.ReadKey();