using System.Text.Json.Serialization;

namespace Cuco.Commons.Base;

public class Response
{
    [JsonPropertyName("status_code")] public int StatusCode { get; init; }
    [JsonPropertyName("details")] public string Details { get; init; }

    public bool IsOkay()
    {
        return StatusCode is >= 200 and < 300;
    }
}