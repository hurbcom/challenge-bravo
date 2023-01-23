using Cuco.Domain.Roles.Models.Entities;
using Cuco.Domain.Roles.Services.Repositories;

namespace Cuco.Infra.Data.Services.Repositories;

public class RoleRepository : Repository<Role>, IRoleRepository
{
    public RoleRepository(CucoDbContext db) : base(db)
    {
    }
}