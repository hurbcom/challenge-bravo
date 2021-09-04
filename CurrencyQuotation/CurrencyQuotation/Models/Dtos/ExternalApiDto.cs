using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace CurrencyQuotation.Models.Dtos
{
    public class ExternalApiDto
    {
        [JsonPropertyName("rates")]
        public IDictionary<string, decimal> Rates { get; set; }
    }
}
