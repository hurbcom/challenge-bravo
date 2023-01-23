using Cuco.Domain.Users.Models.DTO;
using Cuco.Domain.Users.Models.Entities;
using Cuco.Domain.Users.Services.Repositories;
using Cuco.Infra.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Cuco.Infra.Data.Services.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(CucoDbContext db) : base(db)
    {
    }

    public async Task<UserInfo> GetUserInfo(string name, string hashedPassword)
        => await Db.Set<User>()
            .Where(u => u.Name == name && u.Password == hashedPassword)
            .Select(u => new UserInfo() { Name = u.Name, Role = u.Role })
            .FirstOrDefaultAsync();
}