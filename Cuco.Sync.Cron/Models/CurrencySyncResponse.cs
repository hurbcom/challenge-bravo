using System.Text.Json.Serialization;

namespace Cuco.Sync.Cron.Models;

public abstract class CurrencySyncResponse
{
    [JsonPropertyName("timestamp")]
    public int Timestamp { get; set; }

    [JsonPropertyName("status_code")]
    public int StatusCode { get; set; }

    [JsonPropertyName("details")]
    public string Details { get; set; }
}