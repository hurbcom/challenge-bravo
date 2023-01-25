using Cuco.Domain.Roles.Models.Enums;

namespace Cuco.Domain.Users.Models.DTO;

public class SignUpDto
{
    public string Name { get; set; }
    public string Password { get; set; }
    public RoleId Role { get; set; }
}