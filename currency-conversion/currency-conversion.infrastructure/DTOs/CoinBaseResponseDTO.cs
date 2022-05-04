using System.Text.Json.Serialization;

namespace currency_conversion.infrastructure.DTOs
{
    public class CoinBaseResponseDTO
    {
        [JsonPropertyName("data")]
        public DataField? Data { get; set; }
    }

    public class DataField
    {
        [JsonPropertyName("currency")]
        public string? Currency { get; set; }

        [JsonPropertyName("rates")]
        public IDictionary<string, string>? Rates { get; set; }
    }
}
