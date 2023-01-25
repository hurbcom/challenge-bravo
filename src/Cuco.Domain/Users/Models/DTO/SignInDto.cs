using System.Text.Json.Serialization;

namespace Cuco.Domain.Users.Models.DTO;

public class SignInDto
{
    [JsonPropertyName("name")] public string Name { get; set; }

    [JsonPropertyName("password")] public string Password { get; set; }
}