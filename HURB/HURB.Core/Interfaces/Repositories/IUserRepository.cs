using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories.Base;

namespace HURB.Core.Interfaces.Repositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User> GetByName(string name);
    }
}
