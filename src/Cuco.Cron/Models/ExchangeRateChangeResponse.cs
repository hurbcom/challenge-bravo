using System.Text.Json.Serialization;

namespace Cuco.Cron.Models;

public abstract class ExchangeRateChangeResponse
{
    [JsonPropertyName("result")]
    public bool Result { get; set; }

    [JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }
}