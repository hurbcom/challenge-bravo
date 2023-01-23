using System.Text.Json.Serialization;

namespace Cuco.Domain.Users.Models.DTO;

public class TokenDTO
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
    [JsonPropertyName("token")]
    public string Token { get; set; }
}