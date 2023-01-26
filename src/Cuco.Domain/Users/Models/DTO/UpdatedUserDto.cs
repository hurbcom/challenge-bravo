using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Cuco.Domain.Users.Models.DTO;

public class UpdatedUserDto
{
    [Required]
    [JsonPropertyName("new_password")]
    public string NewPassword { get; init; }
}