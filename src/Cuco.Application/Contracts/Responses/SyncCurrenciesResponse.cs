using System.Text.Json.Serialization;
using Cuco.Commons.Base;

namespace Cuco.Application.Contracts.Responses;

public class SyncCurrenciesResponse : Response
{
    [JsonPropertyName("timestamp")] public long Timestamp { get; init; }
}