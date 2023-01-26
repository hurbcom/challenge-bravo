using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Cuco.Domain.Users.Models.DTO;

public class SignInDto
{
    [Required]
    [JsonPropertyName("name")]
    [StringLength(250, MinimumLength = 4)]
    public string Name { get; init; }

    [Required]
    [JsonPropertyName("password")]
    public string Password { get; init; }
}