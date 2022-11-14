using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using HURB.Infrastructure.Data;
using HURB.Infrastructure.Repositories.Base;

namespace HURB.Infrastructure.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(HURBContext context) : base(context)
        {
        }

        public async Task<User> GetByName(string name)
            => await base.SingleOrDefaultAsync(x => x.Name == name);
    }
}
