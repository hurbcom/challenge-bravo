using Cuco.Domain.Users.Extensions;
using Cuco.Domain.Users.Models.DTO;
using Cuco.Domain.Users.Models.Entities;
using Cuco.Domain.Users.Services.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Cuco.Infra.Data.Services.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(CucoDbContext db) : base(db)
    {
    }

    public async Task<UserDto> GetUserDto(string name, string password)
    {
        var user = await Db.Set<User>()
            .Include(u => u.Role)
            .Where(u => u.Name == name)
            .FirstOrDefaultAsync();
        return password.Verify(user.Password)
            ? new UserDto { Name = user.Name, Role = user.Role }
            : null;
    }

    public async Task<bool> DeleteByNameAsync(string name)
    {
        var user = await GetByNameAsync(name);
        if (user is null) return false;

        Db.Set<User>().Remove(user);
        return true;
    }

    public async Task<User> GetByNameAsync(string name)
    {
        return await Db.Set<User>()
            .FirstOrDefaultAsync(u => u.Name == name);
    }
}