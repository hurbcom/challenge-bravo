using Cuco.Commons.Base;
using Cuco.Domain.Roles.Models.Entities;
using Cuco.Domain.Users.Services.Extensions;

namespace Cuco.Domain.Users.Models.Entities;

public class User : Entity
{
    public User(string name, string password, Role role)
    {
        Name = name;
        Password = password.Hash();
        Role = role;
        RoleId = role.Id;
    }

    protected User()
    {
    }

    public string Name { get; }
    public string Password { get; private set; }
    public Role Role { get; }
    public long RoleId { get; }

    public void SetPassword(string newPassword)
    {
        Password = newPassword.Hash();
    }
}