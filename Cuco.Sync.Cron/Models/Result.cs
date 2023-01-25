using System.Text.Json.Serialization;

namespace Cuco.Sync.Cron.Models;

public abstract class Result
{
    [JsonPropertyName("output")] public ExchangeRateChangeResponse ExchangeRateChangeResponse { get; private set; }
}