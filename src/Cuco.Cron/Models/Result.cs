using System.Text.Json.Serialization;

namespace Cuco.Cron.Models;

public abstract class Result
{
    [JsonPropertyName("output")]
    public ExchangeRateChangeResponse ExchangeRateChangeResponse { get; set; }
}