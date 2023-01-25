using System.Text.Json.Serialization;

namespace Cuco.Sync.Cron.Models;

public abstract class ExchangeRateChangeResponse
{
    [JsonPropertyName("result")] public bool Result { get; set; }

    [JsonPropertyName("timestamp")] public long Timestamp { get; private set; }
}