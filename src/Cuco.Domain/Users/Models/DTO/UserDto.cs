using Cuco.Domain.Roles.Models.Entities;

namespace Cuco.Domain.Users.Models.DTO;

public class UserDto
{
    public string Name { get; init; }
    public Role Role { get; init; }
}