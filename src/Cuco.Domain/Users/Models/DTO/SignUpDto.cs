using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Cuco.Domain.Roles.Models.Enums;

namespace Cuco.Domain.Users.Models.DTO;

public class SignUpDto
{
    [Required]
    [JsonPropertyName("name")]
    [StringLength(250, MinimumLength = 4)]
    public string Name { get; set; }
    
    [Required]
    [JsonPropertyName("password")]
    public string Password { get; set; }

    [Required]
    [StringLength(10, MinimumLength = 4)]
    public RoleId Role { get; set; }
}